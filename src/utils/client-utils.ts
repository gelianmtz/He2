import { getRegex } from '../services';
import { canSend, extractDiscordId, parseTag } from '.';
import {
    ApplicationCommand,
    Channel,
    Client,
    DiscordAPIError,
    Guild,
    GuildMember,
    Locale,
    NewsChannel,
    RESTJSONErrorCodes as DiscordApiErrors,
    Role,
    StageChannel,
    TextChannel,
    User,
    VoiceChannel
} from 'discord.js';

const FETCH_MEMBER_LIMIT = 20;
const IGNORED_ERRORS = [
    DiscordApiErrors.UnknownMessage,
    DiscordApiErrors.UnknownChannel,
    DiscordApiErrors.UnknownGuild,
    DiscordApiErrors.UnknownMember,
    DiscordApiErrors.UnknownUser,
    DiscordApiErrors.UnknownInteraction,
    DiscordApiErrors.MissingAccess
];

/**
 * Fetches a guild by ID, handling specific Discord API errors gracefully.
 *
 * @param client The Discord client instance.
 * @param id A raw or formatted Discord guild ID.
 * @returns The guild object, or `null` if not found or on a handled error.
 */
export async function getGuild(client: Client, id: string): Promise<Guild | null> {
    const discordId = extractDiscordId(id);
    if (discordId == null) {
        return null;
    }

    try {
        return await client.guilds.fetch(discordId);
    } catch (error) {
        if (
            error instanceof DiscordAPIError &&
            typeof error.code == 'number' &&
            IGNORED_ERRORS.includes(error.code)
        ) {
            return null;
        } else {
            throw error;
        }
    }
}

/**
 * Fetches a channel by ID, handling specific Discord API errors gracefully.
 *
 * @param client The Discord client instance.
 * @param id A raw or formatted Discord channel ID.
 * @returns The channel object, or `null` if not found or on a handled error.
 */
export async function getChannel(client: Client, id: string): Promise<Channel | null> {
    const discordId = extractDiscordId(id);
    if (discordId == null) {
        return null;
    }

    try {
        return await client.channels.fetch(discordId);
    } catch (error) {
        if (
            error instanceof DiscordAPIError &&
            typeof error.code == 'number' &&
            IGNORED_ERRORS.includes(error.code)
        ) {
            return null;
        } else {
            throw error;
        }
    }
}

/**
 * Fetches a user by ID, handling specific Discord API errors gracefully.
 *
 * @param client The Discord client instance.
 * @param id A raw or formatted Discord user ID.
 * @returns The user object, or `null` if not found or on a handled error.
 */
export async function getUser(client: Client, id: string): Promise<User | null> {
    const discordId = extractDiscordId(id);
    if (discordId == null) {
        return null;
    }

    try {
        return await client.users.fetch(discordId);
    } catch (error) {
        if (
            error instanceof DiscordAPIError &&
            typeof error.code == 'number' &&
            IGNORED_ERRORS.includes(error.code)
        ) {
            return null;
        } else {
            throw error;
        }
    }
}

/**
 * Attempts to find a guild member using a Discord ID, tag, or search query.
 * Handles specific Discord API errors gracefully.
 *
 * @param guild The guild to search in.
 * @param input A Discord ID, username#discriminator, or username string.
 * @returns The found member, or `undefined` if not found or on a handled error.
 */
export async function findAppCommand(
    client: Client,
    name: string
): Promise<ApplicationCommand | undefined> {
    const commands = await client.application?.commands.fetch();
    return commands?.find(command => command.name === name);
}

/**
 * Attempts to find a guild member using a Discord ID, tag, or search query.
 * Handles specific Discord API errors gracefully.
 *
 * @param guild The guild to search in.
 * @param input A Discord ID, username#discriminator, or username string.
 * @returns The found member, or `undefined` if not found or on a handled error.
 */
export async function findMember(guild: Guild, input: string): Promise<GuildMember | undefined> {
    try {
        const discordId = extractDiscordId(input);
        if (discordId != null) {
            return await guild.members.fetch(discordId);
        }

        const tag = parseTag(input);
        if (tag != null) {
            return (
                await guild.members.fetch({ query: tag.username, limit: FETCH_MEMBER_LIMIT })
            ).find(member => member.user.discriminator === tag.discriminator);
        }

        return (await guild.members.fetch({ query: input, limit: 1 })).first();
    } catch (error) {
        if (
            error instanceof DiscordAPIError &&
            typeof error.code == 'number' &&
            IGNORED_ERRORS.includes(error.code)
        ) {
            return;
        } else {
            throw error;
        }
    }
}

/**
 * Attempts to find a role in a guild using a Discord ID or name.
 *
 * @param guild The guild to search in.
 * @param input A Discord ID or name string.
 * @returns The found role, or `null`/`undefined` if not found or on a handled error.
 */
export async function findRole(guild: Guild, input: string): Promise<Role | null | undefined> {
    try {
        const discordId = extractDiscordId(input);
        if (discordId != null) {
            return await guild.roles.fetch(discordId);
        }

        const search = input.trim().toLowerCase().replace(/^@/, '');
        const roles = await guild.roles.fetch();
        return (
            roles.find(role => role.name.toLowerCase() === search) ??
            roles.find(role => role.name.toLowerCase().includes(search))
        );
    } catch (error) {
        if (
            error instanceof DiscordAPIError &&
            typeof error.code == 'number' &&
            IGNORED_ERRORS.includes(error.code)
        ) {
            return;
        } else {
            throw error;
        }
    }
}

/**
 * Attempts to find a text or news channel in a guild by ID or name.
 *
 * @param guild The guild to search in.
 * @param input A Discord ID or channel name.
 * @returns The matching text or news channel, or `undefined` if not found or on a handled error.
 */
export async function findTextChannel(
    guild: Guild,
    input: string
): Promise<NewsChannel | TextChannel | undefined> {
    try {
        const discordId = extractDiscordId(input);
        if (discordId != null) {
            const channel = await guild.channels.fetch(discordId);
            if (channel instanceof NewsChannel || channel instanceof TextChannel) {
                return channel;
            } else {
                return;
            }
        }

        const search = input.trim().toLowerCase().replace(/^#/, '').replaceAll(' ', '-');
        const channels = [...(await guild.channels.fetch()).values()].filter(
            channel => channel instanceof NewsChannel || channel instanceof TextChannel
        );
        return (
            channels.find(channel => channel.name.toLowerCase() === search) ??
            channels.find(channel => channel.name.toLowerCase().includes(search))
        );
    } catch (error) {
        if (
            error instanceof DiscordAPIError &&
            typeof error.code == 'number' &&
            IGNORED_ERRORS.includes(error.code)
        ) {
            return;
        } else {
            throw error;
        }
    }
}

/**
 * Attempts to find a voice or stage channel in a guild by ID or name.
 *
 * @param guild The guild to search in.
 * @param input A Discord ID or channel name.
 * @returns The matching voice or stage channel, or `undefined` if not found or on a handled error.
 */
export async function findVoiceChannel(
    guild: Guild,
    input: string
): Promise<VoiceChannel | StageChannel | undefined> {
    try {
        const discordId = extractDiscordId(input);
        if (discordId != undefined) {
            const channel = await guild.channels.fetch(discordId);
            if (channel instanceof VoiceChannel || channel instanceof StageChannel) {
                return channel;
            } else {
                return;
            }
        }

        const search = input.trim().toLowerCase().replace(/^#/, '');
        const channels = [...(await guild.channels.fetch()).values()].filter(
            channel => channel instanceof VoiceChannel || channel instanceof StageChannel
        );
        return (
            channels.find(channel => channel.name.toLowerCase() === search) ??
            channels.find(channel => channel.name.toLowerCase().includes(search))
        );
    } catch (error) {
        if (
            error instanceof DiscordAPIError &&
            typeof error.code == 'number' &&
            IGNORED_ERRORS.includes(error.code)
        ) {
            return;
        } else {
            throw error;
        }
    }
}

/**
 * Attempts to find a suitable notification channel in the guild:
 * prioritizes the system channel if it's usable, otherwise looks for a
 * text/news channel that matches a language-specific pattern.
 *
 * @param guild The guild to search in.
 * @param languageCode The locale/language code for matching channel names.
 * @returns A usable text or news channel for sending bot notifications.
 */
export async function findNotifyChannel(
    guild: Guild,
    languageCode: Locale
): Promise<TextChannel | NewsChannel> {
    // Prefer the system channel
    const systemChannel = guild.systemChannel;
    if (systemChannel && canSend(systemChannel, true)) {
        return systemChannel;
    }

    // Otherwise look for a bot channel
    return (await guild.channels.fetch()).find(
        channel =>
            (channel instanceof TextChannel || channel instanceof NewsChannel) &&
            canSend(channel, true) &&
            getRegex('channelRegexes.bot', languageCode).test(channel.name)
    ) as TextChannel | NewsChannel;
}
