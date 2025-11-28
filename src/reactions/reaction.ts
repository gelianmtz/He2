import { EventData } from '../models';
import { Message, MessageReaction, User } from 'discord.js';

/**
 * Represents a reaction handler for a specific emoji with associated conditions.
 */
export interface Reaction {
    /**
     * The emoji string this reaction handler listens for.
     * Can be a Unicode emoji or a custom Discord emoji identifier.
     */
    emoji: string;

    /**
     * Whether the reaction must occur in a guild (server) context.
     * If true, reactions in direct messages will be ignored.
     */
    requireGuild: boolean;

    /**
     * Whether the reacted message must have been sent by the client (bot).
     */
    requireSentByClient: boolean;

    /**
     * Whether the reacted message must have an embed with the author tag matching certain criteria.
     */
    requireEmbedAuthorTag: boolean;

    /**
     * Executes the reaction handler logic when the reaction criteria are met.
     *
     * @param messageReaction The reaction object from discord.js.
     * @param message The message to which the reaction was added.
     * @param reactor The user who added the reaction.
     * @param data Additional event data or context.
     */
    execute(
        messageReaction: MessageReaction,
        message: Message,
        reactor: User,
        data: EventData
    ): Promise<void>;
}
