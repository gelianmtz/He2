import {
    BaseMessageOptions,
    DiscordAPIError,
    EmbedBuilder,
    EmojiResolvable,
    Message,
    MessageEditOptions,
    MessageReaction,
    PartialGroupDMChannel,
    RESTJSONErrorCodes as DiscordApiErrors,
    StartThreadOptions,
    TextBasedChannel,
    ThreadChannel,
    User
} from 'discord.js';

const IGNORED_ERRORS = [
    DiscordApiErrors.UnknownMessage,
    DiscordApiErrors.UnknownChannel,
    DiscordApiErrors.UnknownGuild,
    DiscordApiErrors.UnknownUser,
    DiscordApiErrors.UnknownInteraction,
    DiscordApiErrors.CannotSendMessagesToThisUser, // User blocked bot or DM disabled
    DiscordApiErrors.ReactionWasBlocked, // User blocked bot or DM disabled
    DiscordApiErrors.MaximumActiveThreads
];

/**
 * Sends a message to a user or text-based channel, handling specific Discord API errors gracefully.
 *
 * @param target The user or channel to send the message to.
 * @param content The message content, embed, or full message options.
 * @returns The sent message, or `undefined` if sending failed due to an ignored error.
 */
export async function sendMessage(
    target: User | TextBasedChannel,
    content: string | EmbedBuilder | BaseMessageOptions
): Promise<Message | undefined> {
    if (target instanceof PartialGroupDMChannel) {
        return;
    }

    try {
        const options =
            typeof content === 'string'
                ? { content }
                : content instanceof EmbedBuilder
                  ? { embeds: [content] }
                  : content;
        return await target.send(options);
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
 * Replies to a message, handling specific Discord API errors gracefully.
 *
 * @param message The message to reply to.
 * @param content The reply content, embed, or full message options.
 * @returns The reply message, or `undefined` if replying failed due to an ignored error.
 */
export async function reply(
    message: Message,
    content: string | EmbedBuilder | BaseMessageOptions
): Promise<Message | undefined> {
    try {
        const options =
            typeof content === 'string'
                ? { content }
                : content instanceof EmbedBuilder
                  ? { embeds: [content] }
                  : content;
        return await message.reply(options);
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
 * Edits a message with new content, embed, or options, handling specific Discord API errors.
 *
 * @param message The message to edit.
 * @param content The new content, embed, or message edit options.
 * @returns The edited message, or `undefined` if editing failed due to an ignored error.
 */
export async function edit(
    message: Message,
    content: string | EmbedBuilder | MessageEditOptions
): Promise<Message | undefined> {
    try {
        const options: MessageEditOptions =
            typeof content === 'string'
                ? { content }
                : content instanceof EmbedBuilder
                  ? { embeds: [content] }
                  : content;
        return await message.edit(options);
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
 * Reacts to a message with a given emoji, handling specific Discord API errors.
 *
 * @param message The message to react to.
 * @param emoji The emoji to react with.
 * @returns The message reaction, or `undefined` if the reaction failed due to an ignored error.
 */
export async function react(
    message: Message,
    emoji: EmojiResolvable
): Promise<MessageReaction | undefined> {
    try {
        return await message.react(emoji);
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
 * Pins or unpins a message, handling specific Discord API errors.
 *
 * @param message The message to pin or unpin.
 * @param pinned Whether to pin (`true`) or unpin (`false`) the message. Defaults to `true`.
 * @returns The pinned/unpinned message, or `undefined` if the operation failed due to an ignored error.
 */
export async function pin(message: Message, pinned = true): Promise<Message | undefined> {
    try {
        return pinned ? await message.pin() : await message.unpin();
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
 * Starts a thread from a message, handling specific Discord API errors.
 *
 * @param message The message to start the thread from.
 * @param options The options for starting the thread.
 * @returns The created thread channel, or `undefined` if the operation failed due to an ignored error.
 */
export async function startThread(
    message: Message,
    options: StartThreadOptions
): Promise<ThreadChannel | undefined> {
    try {
        return await message.startThread(options);
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
 * Deletes a message, handling specific Discord API errors.
 *
 * @param message The message to delete.
 * @returns The deleted message, or `undefined` if deletion failed due to an ignored error.
 */
export async function erase(message: Message): Promise<Message | undefined> {
    try {
        return await message.delete();
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
