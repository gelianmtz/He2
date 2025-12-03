import { EventData } from '../models';
import { ButtonInteraction } from 'discord.js';

/**
 * Represents a button handler definition for a Discord interaction.
 */
export interface Button {
    /**
     * The custom ID(s) that this button handler is responsible for.
     */
    ids: string[];
    /**
     * Determines how the interaction should be deferred.
     */
    deferType: ButtonDeferType;
    /**
     * Whether the interaction must occur in a guild context.
     */
    requireGuild: boolean;
    /**
     * Whether the interaction must match the embed's author tag with the user who triggered the button.
     */
    requireEmbedAuthorTag: boolean;

    /**
     * Executes the button interaction logic.
     *
     * @param interaction The button interaction object from Discord.js.
     * @param data Custom application data passed alongside the interaction.
     */
    execute(interaction: ButtonInteraction, data: EventData): Promise<void>;
}

/**
 * Represents the type of deferral behavior for a button interaction.
 */
export enum ButtonDeferType {
    /**
     * Defers the interaction with a reply.
     */
    REPLY = 'REPLY',
    /**
     * Defers the interaction by updating the existing message.
     */
    UPDATE = 'UPDATE',
    /**
     * Does not defer the interaction.
     */
    NONE = 'NONE'
}
