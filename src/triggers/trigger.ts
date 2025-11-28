import { EventData } from '../models';
import { Message } from 'discord.js';

/**
 * Represents a trigger that listens for and responds to a specific type of message event.
 */
export interface Trigger {
    /**
     * Indicates whether the trigger should only activate in a guild (server) context.
     */
    requireGuild: boolean;

    /**
     * Determines whether this trigger should activate for the given message.
     *
     * @param message The Discord message to evaluate.
     * @returns `true` if the trigger should activate, otherwise `false`.
     */
    triggered(message: Message): boolean;

    /**
     * Executes the trigger's action in response to the given message.
     *
     * @param message The Discord message that activated the trigger.
     * @param data Additional contextual data for the event.
     * @returns A `Promise` that resolves when the trigger's action is complete.
     */
    execute(message: Message, data: EventData): Promise<void>;
}
