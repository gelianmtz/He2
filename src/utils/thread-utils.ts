import { DiscordAPIError, RESTJSONErrorCodes as DiscordApiErrors, ThreadChannel } from 'discord.js';

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
 * Archives or unarchives a thread channel.
 *
 * @param thread The thread channel to archive or unarchive.
 * @param archived Whether to archive (`true`) or unarchive (`false`) the thread. Defaults to `true`.
 * @returns The updated thread channel if successful, or `undefined` if the error was in the ignored list.
 *
 * @throws Will rethrow any error not included in the ignored list.
 */
export async function archive(
    thread: ThreadChannel,
    archived = true
): Promise<ThreadChannel | undefined> {
    try {
        return await thread.setArchived(archived);
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
 * Locks or unlocks a thread channel.
 *
 * @param thread The thread channel to lock or unlock.
 * @param locked Whether to lock (`true`) or unlock (`false`) the thread. Defaults to `true`.
 * @returns The updated thread channel if successful, or `undefined` if the error was in the ignored list.
 *
 * @throws Will rethrow any error not included in the ignored list.
 */
export async function lock(
    thread: ThreadChannel,
    locked = true
): Promise<ThreadChannel | undefined> {
    try {
        return await thread.setLocked(locked);
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
