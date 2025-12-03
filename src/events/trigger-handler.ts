import Config from '../../config/config.json';
import { EventDataService } from '../services';
import { Trigger } from '../triggers';
import { Message } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

/**
 * Handles triggers caused by message content.
 *
 * Applies rate limiting and evaluates all registered triggers to execute
 * applicable responses to the message.
 */
export class TriggerHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.triggers.amount,
        Config.rateLimiting.triggers.interval * 1000
    );

    constructor(
        private triggers: Trigger[],
        private eventDataService: EventDataService
    ) {}

    public async process(message: Message): Promise<void> {
        // Check if user is rate limited
        if (this.rateLimiter.take(message.author.id)) {
            return;
        }

        // Find triggers caused by this message
        const triggers = this.triggers.filter(trigger => {
            if (trigger.requireGuild && message.guild == null) {
                return false;
            }

            if (!trigger.triggered(message)) {
                return false;
            }

            return true;
        });

        // If this message causes no triggers then return
        if (triggers.length === 0) {
            return;
        }

        // Get data from database
        const data = await this.eventDataService.create({
            user: message.author,
            channel: message.channel,
            guild: message.guild
        });

        // Execute triggers
        for (const trigger of triggers) {
            await trigger.execute(message, data);
        }
    }
}
