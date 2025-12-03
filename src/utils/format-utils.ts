import { ApplicationCommand, Guild, Locale } from 'discord.js';
import { filesize } from 'filesize';
import { Duration } from 'luxon';

/**
 * Formats a role ID or special case into a Discord role mention string.
 *
 * @param guild The guild where the role exists.
 * @param discordId The role ID or a special mention like "@here".
 * @returns A formatted role mention.
 *
 * @example
 * roleMention(guild, '123456789012345678'); // => "<@&123456789012345678>"
 */
export function roleMention(guild: Guild, discordId: string): string {
    if (discordId === '@here') {
        return discordId;
    }

    if (discordId === guild.id) {
        return '@everyone';
    }

    return `<@&${discordId}>`;
}

/**
 * Formats a channel ID into a Discord channel mention string.
 *
 * @param discordId The channel ID.
 * @returns A formatted channel mention.
 *
 * @example
 * channelMention('123456789012345678'); // => "<#123456789012345678>"
 */
export function channelMention(discordId: string): string {
    return `<#${discordId}>`;
}

/**
 * Formats a user ID into a Discord user mention string.
 *
 * @param discordId The user ID.
 * @returns A formatted user mention.
 *
 * @example
 * FormatUtils.userMention('123456789012345678'); // => "<@!123456789012345678>"
 */
export function userMention(discordId: string): string {
    return `<@!${discordId}>`;
}

/**
 * Formats a command into a Discord slash command mention string.
 *
 * @param command The ApplicationCommand object.
 * @param subparts Optional array of subcommand and/or subcommand group names.
 * @returns A formatted command mention.
 *
 * @example
 * commandMention(command, ['sub']); // => "</command sub:commandId>"
 */
export function commandMention(command: ApplicationCommand, subparts: string[] = []): string {
    const name = [command.name, ...subparts].join(' ');
    return `</${name}:${command.id}>`;
}

/**
 * Converts a duration in milliseconds to a human-readable string using the specified locale.
 *
 * @param milliseconds The duration in milliseconds.
 * @param languageCode The locale code (e.g., "en", "fr", "de") used for formatting.
 * @returns A human-readable duration string.
 *
 * @example
 * duration(3600000, 'en'); // => "1 hour"
 */
export function duration(milliseconds: number, languageCode: Locale): string {
    return Duration.fromObject(
        Object.fromEntries(
            Object.entries(
                Duration.fromMillis(milliseconds, { locale: languageCode })
                    .shiftTo('year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second')
                    .toObject()
            ).filter(([, value]) => !!value) // Remove units that are 0
        )
    ).toHuman({ maximumFractionDigits: 0 });
}

/**
 * Converts a file size in bytes to a human-readable string with units.
 *
 * @param bytes The size in bytes.
 * @returns A formatted file size string.
 *
 * @example
 * fileSize(1048576); // => "1.00 MB"
 */
export function fileSize(bytes: number): string {
    return filesize(bytes, { output: 'string', pad: true, round: 2 });
}
