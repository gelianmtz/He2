import { Channel, DMChannel, GuildChannel, PermissionFlagsBits, ThreadChannel } from 'discord.js';

/**
 * Checks if the bot can send messages in the specified channel.
 *
 * @param channel The Discord channel to check permissions for.
 * @param embedLinks Whether sending embedded links is also required.
 * @returns `true` if the bot can send messages (and embeds if specified), otherwise `false`.
 */
export function canSend(channel: Channel, embedLinks = false): boolean {
    if (channel instanceof DMChannel) {
        return true;
    } else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
        const channelPerms = channel.permissionsFor(channel.client.user);
        if (channelPerms == null) {
            // This can happen if the guild disconnected while a collector is running
            return false;
        }

        // VIEW_CHANNEL - Needed to view the channel
        // SEND_MESSAGES - Needed to send messages
        // EMBED_LINKS - Needed to send embedded links
        return channelPerms.has([
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            ...(embedLinks ? [PermissionFlagsBits.EmbedLinks] : [])
        ]);
    } else {
        return false;
    }
}

/**
 * Checks if the bot can mention `@everyone`, `@here`, or roles in the specified channel.
 *
 * @param channel The Discord channel to check permissions for.
 * @returns `true` if the bot has permission to mention everyone, otherwise `false`.
 */
export function canMention(channel: Channel): boolean {
    if (channel instanceof DMChannel) {
        return true;
    } else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
        const channelPerms = channel.permissionsFor(channel.client.user);
        if (channelPerms == null) {
            // This can happen if the guild disconnected while a collector is running
            return false;
        }

        // VIEW_CHANNEL - Needed to view the channel
        // MENTION_EVERYONE - Needed to mention @everyone, @here, and all roles
        return channelPerms.has([
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.MentionEveryone
        ]);
    } else {
        return false;
    }
}

/**
 * Checks if the bot can add reactions to messages in the specified channel,
 * and optionally if it can remove others' reactions.
 *
 * @param channel The Discord channel to check permissions for.
 * @param removeOthers Whether removing others' reactions is also required.
 * @returns `true` if the bot can react (and optionally remove others' reactions), otherwise `false`.
 */
export function canReact(channel: Channel, removeOthers = false): boolean {
    if (channel instanceof DMChannel) {
        return true;
    } else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
        const channelPerms = channel.permissionsFor(channel.client.user);
        if (channelPerms == null) {
            // This can happen if the guild disconnected while a collector is running
            return false;
        }

        // VIEW_CHANNEL - Needed to view the channel
        // ADD_REACTIONS - Needed to add new reactions to messages
        // READ_MESSAGE_HISTORY - Needed to add new reactions to messages
        //    https://discordjs.guide/popular-topics/permissions-extended.html#implicit-permissions
        // MANAGE_MESSAGES - Needed to remove others reactions
        return channelPerms.has([
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.AddReactions,
            PermissionFlagsBits.ReadMessageHistory,
            ...(removeOthers ? [PermissionFlagsBits.ManageMessages] : [])
        ]);
    } else {
        return false;
    }
}

/**
 * Checks if the bot can pin messages in the specified channel,
 * and optionally if it can find old pins.
 *
 * @param channel The Discord channel to check permissions for.
 * @param findOld Whether access to read message history is required to find old pins.
 * @returns `true` if the bot can pin messages (and read old ones if specified), otherwise `false`.
 */
export function canPin(channel: Channel, findOld = false): boolean {
    if (channel instanceof DMChannel) {
        return true;
    } else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
        const channelPerms = channel.permissionsFor(channel.client.user);
        if (channelPerms == null) {
            // This can happen if the guild disconnected while a collector is running
            return false;
        }

        // VIEW_CHANNEL - Needed to view the channel
        // MANAGE_MESSAGES - Needed to pin messages
        // READ_MESSAGE_HISTORY - Needed to find old pins
        return channelPerms.has([
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ManageMessages,
            ...(findOld ? [PermissionFlagsBits.ReadMessageHistory] : [])
        ]);
    } else {
        return false;
    }
}

/**
 * Checks if the bot can create and manage threads in the specified channel.
 *
 * @param channel The Discord channel to check permissions for.
 * @param manageThreads Whether thread management permissions (rename, delete, archive) are required.
 * @param findOld Whether access to read message history is required to find old threads.
 * @returns `true` if the bot can create threads (and optionally manage or read old ones), otherwise `false`.
 */
export function canCreateThreads(
    channel: Channel,
    manageThreads = false,
    findOld = false
): boolean {
    if (channel instanceof DMChannel) {
        return false;
    } else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
        const channelPerms = channel.permissionsFor(channel.client.user);
        if (channelPerms == null) {
            // This can happen if the guild disconnected while a collector is running
            return false;
        }

        // VIEW_CHANNEL - Needed to view the channel
        // SEND_MESSAGES_IN_THREADS - Needed to send messages in threads
        // CREATE_PUBLIC_THREADS - Needed to create public threads
        // MANAGE_THREADS - Needed to rename, delete, archive, unarchive, slow mode threads
        // READ_MESSAGE_HISTORY - Needed to find old threads
        return channelPerms.has([
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessagesInThreads,
            PermissionFlagsBits.CreatePublicThreads,
            ...(manageThreads ? [PermissionFlagsBits.ManageThreads] : []),
            ...(findOld ? [PermissionFlagsBits.ReadMessageHistory] : [])
        ]);
    } else {
        return false;
    }
}
