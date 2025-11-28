import { EventHandler, TriggerHandler } from '.';
import { Message } from 'discord.js';

/**
 * Handles message creation events.
 *
 * Filters system messages and self-authored messages, then passes valid messages
 * to the `TriggerHandler` for further processing.
 */
export class MessageHandler implements EventHandler {
    constructor(private triggerHandler: TriggerHandler) {}

    public async process(message: Message): Promise<void> {
        // Don't respond to system messages or self
        if (message.system || message.author.id === message.client.user.id) {
            return;
        }

        // Process trigger
        await this.triggerHandler.process(message);
    }
}
