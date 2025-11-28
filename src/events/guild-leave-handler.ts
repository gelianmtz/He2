import Logs from '../../lang/logs.json';
import { Logger } from '../services';
import { EventHandler } from '.';
import { Guild } from 'discord.js';

/**
 * Handles the event triggered when the bot leaves a Discord guild (server).
 *
 * This class implements the `EventHandler` interface for `Guild` events and logs the
 * departure of the bot from a guild.
 */
export class GuildLeaveHandler implements EventHandler {
    public async process(guild: Guild): Promise<void> {
        Logger.info(
            Logs.info.guildLeft
                .replaceAll('{GUILD_NAME}', guild.name)
                .replaceAll('{GUILD_ID}', guild.id)
        );
    }
}
