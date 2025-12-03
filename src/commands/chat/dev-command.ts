import Config from '../../../config/config.json';
import tsConfig from '../../../tsconfig.json';
import { DevCommandName } from '../../enums';
import { EventData } from '../../models';
import { DefaultLocale } from '../../models/enum-helpers';
import { getEmbed, getRef } from '../../services';
import { fileSize, getServerCount, send } from '../../utils';
import { Command, CommandDeferType } from '../command';
import discordjs, { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import typescript from 'typescript';
import os from 'node:os';

export class DevCommand implements Command {
    public names = [getRef('chatCommands.dev', DefaultLocale)];
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(interaction: ChatInputCommandInteraction, data: EventData): Promise<void> {
        if (!Config.developers.includes(parseInt(interaction.user.id))) {
            await send(interaction, getEmbed('validationEmbeds.devOnly', data.language));
            return;
        }

        const args = {
            command: interaction.options.getString(
                getRef('arguments.command', DefaultLocale)
            ) as DevCommandName
        };

        switch (args.command) {
            case DevCommandName.INFO: {
                const shardCount = interaction.client.shard?.count ?? 1;
                let serverCount: number;
                if (interaction.client.shard) {
                    try {
                        serverCount = await getServerCount(interaction.client.shard);
                    } catch (error) {
                        if (error instanceof Error && error.name.includes('ShardingInProcess')) {
                            await send(
                                interaction,
                                getEmbed('errorEmbeds.startupInProcess', data.language)
                            );
                            return;
                        } else {
                            throw error;
                        }
                    }
                } else {
                    serverCount = interaction.client.guilds.cache.size;
                }

                const memory = process.memoryUsage();

                await send(
                    interaction,
                    getEmbed('displayEmbeds.devInfo', data.language, {
                        NODE_VERSION: process.version,
                        TS_VERSION: `v${typescript.version}`,
                        ES_VERSION: tsConfig.compilerOptions.target,
                        DJS_VERSION: `v${discordjs.version}`,
                        SHARD_COUNT: shardCount.toLocaleString(data.language),
                        SERVER_COUNT: serverCount.toLocaleString(data.language),
                        SERVER_COUNT_PER_SHARD: Math.round(serverCount / shardCount).toLocaleString(
                            data.language
                        ),
                        RSS_SIZE: fileSize(memory.rss),
                        RSS_SIZE_PER_SERVER:
                            serverCount > 0
                                ? fileSize(memory.rss / serverCount)
                                : getRef('other.na', data.language),
                        HEAP_TOTAL_SIZE: fileSize(memory.heapTotal),
                        HEAP_TOTAL_SIZE_PER_SERVER:
                            serverCount > 0
                                ? fileSize(memory.heapTotal / serverCount)
                                : getRef('other.na', data.language),
                        HEAP_USED_SIZE: fileSize(memory.heapUsed),
                        HEAP_USED_SIZE_PER_SERVER:
                            serverCount > 0
                                ? fileSize(memory.heapUsed / serverCount)
                                : getRef('other.na', data.language),
                        HOSTNAME: os.hostname(),
                        SHARD_ID: (interaction.guild?.shardId ?? 0).toString(),
                        SERVER_ID: interaction.guild?.id ?? getRef('other.na', data.language),
                        BOT_ID: interaction.client.user?.id,
                        USER_ID: interaction.user.id
                    })
                );
                break;
            }
            default:
                return;
        }
    }
}
