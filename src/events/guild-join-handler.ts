import Logs from '../../lang/logs.json';
import { DefaultLocale } from '../models/enum-helpers';
import { EventDataService, getEmbed, getRef, Logger } from '../services';
import { commandMention, findAppCommand, findNotifyChannel, sendMessage } from '../utils';
import { EventHandler } from '.';
import { Guild } from 'discord.js';

/**
 * Handles the `GuildCreate` event when the bot joins a new guild.
 *
 * This handler logs the guild join, saves initial data to the database, and sends a welcome message
 * both to the designated notify channel (if available) and directly to the guild owner.
 */
export class GuildJoinHandler implements EventHandler {
    /**
     * Creates a new instance of the handler.
     *
     * @param eventDataService Service used to persist and retrieve event-related data.
     */
    constructor(private eventDataService: EventDataService) {}

    public async process(guild: Guild): Promise<void> {
        Logger.info(
            Logs.info.guildJoined
                .replaceAll('{GUILD_NAME}', guild.name)
                .replaceAll('{GUILD_ID}', guild.id)
        );

        const owner = await guild.fetchOwner();

        // Get data from database
        const data = await this.eventDataService.create({
            user: owner.user,
            guild
        });

        const helpCommand = await findAppCommand(
            guild.client,
            getRef('chatCommands.help', DefaultLocale)
        );
        if (helpCommand !== undefined) {
            // Send welcome message to the server's notify channel
            const notifyChannel = await findNotifyChannel(guild, data.guildLanguage);
            await sendMessage(
                notifyChannel,
                getEmbed('displayEmbeds.welcome', data.guildLanguage, {
                    CMD_LINK_HELP: commandMention(helpCommand)
                }).setAuthor({
                    name: guild.name,
                    iconURL: guild.iconURL() ?? undefined
                })
            );

            // Send welcome message to owner
            await sendMessage(
                owner.user,
                getEmbed('displayEmbeds.welcome', data.language, {
                    CMD_LINK_HELP: commandMention(helpCommand)
                }).setAuthor({
                    name: guild.name,
                    iconURL: guild.iconURL() ?? undefined
                })
            );
        }
    }
}
