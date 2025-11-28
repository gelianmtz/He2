import Config from '../../config/config.json';
import Logs from '../../lang/logs.json';
import { Logger } from '.';
import { REST } from '@discordjs/rest';
import {
    APIApplicationCommand,
    RESTGetAPIApplicationCommandsResult,
    RESTPatchAPIApplicationCommandJSONBody,
    RESTPostAPIApplicationCommandsJSONBody,
    Routes
} from 'discord.js';

export class CommandRegistrationService {
    constructor(private rest: REST) {}

    public async process(
        localCommands: RESTPostAPIApplicationCommandsJSONBody[],
        args: string[]
    ): Promise<void> {
        const remoteCommands = (await this.rest.get(
            Routes.applicationCommands(Config.client.id)
        )) as RESTGetAPIApplicationCommandsResult;

        const localCommandsOnRemote = localCommands.filter(localCmd =>
            remoteCommands.some(remoteCmd => remoteCmd.name === localCmd.name)
        );
        const localCommandsOnly = localCommands.filter(
            localCmd => !remoteCommands.some(remoteCmd => remoteCmd.name === localCmd.name)
        );
        const remoteCommandsOnly = remoteCommands.filter(
            remoteCmd => !localCommands.some(localCmd => localCmd.name === remoteCmd.name)
        );

        switch (args[3]) {
            case 'view': {
                Logger.info(
                    Logs.info.commandActionView
                        .replaceAll(
                            '{LOCAL_AND_REMOTE_LIST}',
                            this.formatCommandList(localCommandsOnRemote)
                        )
                        .replaceAll('{LOCAL_ONLY_LIST}', this.formatCommandList(localCommandsOnly))
                        .replaceAll(
                            '{REMOTE_ONLY_LIST}',
                            this.formatCommandList(remoteCommandsOnly)
                        )
                );
                return;
            }
            case 'register': {
                if (localCommandsOnly.length > 0) {
                    Logger.info(
                        Logs.info.commandActionCreating.replaceAll(
                            '{COMMAND_LIST}',
                            this.formatCommandList(localCommandsOnly)
                        )
                    );
                    for (const localCmd of localCommandsOnly) {
                        await this.rest.post(Routes.applicationCommands(Config.client.id), {
                            body: localCmd
                        });
                    }
                    Logger.info(Logs.info.commandActionCreated);
                }

                if (localCommandsOnRemote.length > 0) {
                    Logger.info(
                        Logs.info.commandActionUpdating.replaceAll(
                            '{COMMAND_LIST}',
                            this.formatCommandList(localCommandsOnRemote)
                        )
                    );
                    for (const localCmd of localCommandsOnRemote) {
                        await this.rest.post(Routes.applicationCommands(Config.client.id), {
                            body: localCmd
                        });
                    }
                    Logger.info(Logs.info.commandActionUpdated);
                }

                return;
            }
            case 'rename': {
                const oldName = args.at(4);
                const newName = args.at(5);
                if (oldName === undefined || newName === undefined) {
                    Logger.error(Logs.error.commandActionRenameMissingArg);
                    return;
                }

                const remoteCommand = remoteCommands.find(remoteCmd => remoteCmd.name == oldName);
                if (remoteCommand === undefined) {
                    Logger.error(
                        Logs.error.commandActionNotFound.replaceAll('{COMMAND_NAME}', oldName)
                    );
                    return;
                }

                Logger.info(
                    Logs.info.commandActionRenaming
                        .replaceAll('{OLD_COMMAND_NAME}', remoteCommand.name)
                        .replaceAll('{NEW_COMMAND_NAME}', newName)
                );
                const body: RESTPatchAPIApplicationCommandJSONBody = {
                    name: newName
                };
                await this.rest.patch(
                    Routes.applicationCommand(Config.client.id, remoteCommand.id),
                    {
                        body
                    }
                );
                Logger.info(Logs.info.commandActionRenamed);
                return;
            }
            case 'delete': {
                const name = args.at(4);
                if (name === undefined) {
                    Logger.error(Logs.error.commandActionDeleteMissingArg);
                    return;
                }

                const remoteCommand = remoteCommands.find(remoteCmd => remoteCmd.name == name);
                if (remoteCommand === undefined) {
                    Logger.error(
                        Logs.error.commandActionNotFound.replaceAll('{COMMAND_NAME}', name)
                    );
                    return;
                }

                Logger.info(
                    Logs.info.commandActionDeleting.replaceAll('{COMMAND_NAME}', remoteCommand.name)
                );
                await this.rest.delete(
                    Routes.applicationCommand(Config.client.id, remoteCommand.id)
                );
                Logger.info(Logs.info.commandActionDeleted);
                return;
            }
            case 'clear': {
                Logger.info(
                    Logs.info.commandActionClearing.replaceAll(
                        '{COMMAND_LIST}',
                        this.formatCommandList(remoteCommands)
                    )
                );
                await this.rest.put(Routes.applicationCommands(Config.client.id), { body: [] });
                Logger.info(Logs.info.commandActionCleared);
                return;
            }
        }
    }

    private formatCommandList(
        commands: RESTPostAPIApplicationCommandsJSONBody[] | APIApplicationCommand[]
    ): string {
        return commands.length > 0
            ? commands.map((cmd: { name: string }) => `'${cmd.name}'`).join(', ')
            : 'N/A';
    }
}
