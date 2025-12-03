import { HelpOption } from '../../enums';
import { EventData } from '../../models';
import { DefaultLocale } from '../../models/enum-helpers';
import { getEmbed, getRef } from '../../services';
import { commandMention, findAppCommand, send } from '../../utils';
import { Command, CommandDeferType } from '../command';
import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';

export class HelpCommand implements Command {
    public names = [getRef('chatCommands.help', DefaultLocale)];
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(interaction: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            option: interaction.options.getString(
                getRef('arguments.option', DefaultLocale)
            ) as HelpOption
        };

        let embed: EmbedBuilder;
        switch (args.option) {
            case HelpOption.CONTACT_SUPPORT: {
                embed = getEmbed('displayEmbeds.helpContactSupport', data.language);
                break;
            }
            case HelpOption.COMMANDS: {
                const commandTest = await findAppCommand(
                    interaction.client,
                    getRef('chatCommands.test', DefaultLocale)
                );
                const commandInfo = await findAppCommand(
                    interaction.client,
                    getRef('chatCommands.info', DefaultLocale)
                );
                if (commandTest === undefined || commandInfo === undefined) {
                    return;
                }

                embed = getEmbed('displayEmbeds.helpCommands', data.language, {
                    CMD_LINK_TEST: commandMention(commandTest),
                    CMD_LINK_INFO: commandMention(commandInfo)
                });
                break;
            }
            default:
                return;
        }

        await send(interaction, embed);
    }
}
