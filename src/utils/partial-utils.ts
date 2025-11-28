import {
    DiscordAPIError,
    Message,
    MessageReaction,
    PartialMessage,
    PartialMessageReaction,
    PartialUser,
    RESTJSONErrorCodes as DiscordApiErrors,
    User
} from 'discord.js';

const IGNORED_ERRORS = [
    DiscordApiErrors.UnknownMessage,
    DiscordApiErrors.UnknownChannel,
    DiscordApiErrors.UnknownGuild,
    DiscordApiErrors.UnknownUser,
    DiscordApiErrors.UnknownInteraction,
    DiscordApiErrors.MissingAccess
];

/**
 * Attempts to fetch and return a fully populated `User` object
 * if the given user is partial.
 *
 * @param user A full or partial Discord `User` object.
 * @returns A fully populated `User`, or `undefined` if fetching failed and the error was ignored.
 */
export async function fillUser(user: User | PartialUser): Promise<User | undefined> {
    if (user.partial) {
        try {
            return await user.fetch();
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

    return user as User;
}

/**
 * Attempts to fetch and return a fully populated `Message` object
 * if the given message is partial.
 *
 * @param message A full or partial Discord `Message` object.
 * @returns A fully populated `Message`, or `undefined` if fetching failed and the error was ignored.
 */
export async function fillMessage(message: Message | PartialMessage): Promise<Message | undefined> {
    if (message.partial) {
        try {
            return await message.fetch();
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

    return message as Message;
}

/**
 * Attempts to fetch and return a fully populated `MessageReaction` object
 * if the given reaction is partial. Also ensures the associated message is fully populated.
 *
 * @param messageReaction A full or partial Discord `MessageReaction` object.
 * @returns A fully populated `MessageReaction`, or `undefined` if fetching failed or the message could not be filled.
 */
export async function fillReaction(
    messageReaction: MessageReaction | PartialMessageReaction
): Promise<MessageReaction | undefined> {
    if (messageReaction.partial) {
        try {
            messageReaction = await messageReaction.fetch();
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

    const fullMessage = await fillMessage(messageReaction.message);
    if (fullMessage === undefined) {
        return;
    }

    messageReaction.message = fullMessage;
    return messageReaction as MessageReaction;
}
