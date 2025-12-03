import Config from '../../config/config.json';
import { Button, ButtonDeferType } from '../buttons';
import { EventDataService } from '../services';
import { deferReply, deferUpdate } from '../utils';
import { EventHandler } from '.';
import { ButtonInteraction } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

/**
 * Handles incoming button interactions from Discord, matching them to registered
 * buttons and executing their logic.
 *
 * Includes rate-limiting and safety checks to prevent abuse and ensure only valid
 * interactions are processed.
 */
export class ButtonHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.buttons.amount,
        Config.rateLimiting.buttons.interval * 1000
    );

    /**
     * Creates a new instance of `ButtonHandler`.
     *
     * @param buttons An array of available button definitions to handle.
     * @param eventDataService A service for creating localized event context.
     */
    constructor(
        private buttons: Button[],
        private eventDataService: EventDataService
    ) {}

    public async process(interaction: ButtonInteraction): Promise<void> {
        // Don't respond to self, or other bots
        if (interaction.user.id === interaction.client.user?.id || interaction.user.bot) {
            return;
        }

        // Check if user is rate limited
        if (this.rateLimiter.take(interaction.user.id)) {
            return;
        }

        // Try to find the button the user wants
        const button = this.findButton(interaction.customId);
        if (button === undefined) {
            return;
        }

        if (button.requireGuild && !interaction.guild) {
            return;
        }

        // Check if the embeds author equals the users tag
        if (
            button.requireEmbedAuthorTag &&
            interaction.message.embeds[0]?.author?.name !== interaction.user.tag
        ) {
            return;
        }

        // Defer interaction
        // NOTE: Anything after this point we should be responding to the interaction
        switch (button.deferType) {
            case ButtonDeferType.REPLY: {
                await deferReply(interaction);
                break;
            }
            case ButtonDeferType.UPDATE: {
                await deferUpdate(interaction);
                break;
            }
        }

        // Return if defer was unsuccessful
        if (button.deferType !== ButtonDeferType.NONE && !interaction.deferred) {
            return;
        }

        // Get data from database
        const data = await this.eventDataService.create({
            user: interaction.user,
            channel: interaction.channel,
            guild: interaction.guild
        });

        // Execute the button
        await button.execute(interaction, data);
    }

    private findButton(id: string): Button | undefined {
        return this.buttons.find(button => button.ids.includes(id));
    }
}
