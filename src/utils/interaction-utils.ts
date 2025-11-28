import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    CommandInteraction,
    DiscordAPIError,
    EmbedBuilder,
    InteractionCallbackResponse,
    InteractionReplyOptions,
    InteractionResponse,
    InteractionUpdateOptions,
    Message,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    RESTJSONErrorCodes as DiscordApiErrors,
    WebhookMessageEditOptions
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
 * Defers a reply to a command, button, or modal interaction.
 * Optionally makes the response ephemeral (hidden).
 *
 * @param interaction The interaction to defer a reply to.
 * @param hidden Whether the reply should be ephemeral.
 * @returns The interaction response, or `undefined` if ignored due to an API error.
 */
export async function deferReply(
    interaction: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
    hidden = false
): Promise<InteractionResponse | undefined> {
    try {
        return await interaction.deferReply({
            flags: hidden ? ['Ephemeral'] : undefined
        });
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
 * Defers the update of a component or modal interaction.
 *
 * @param interaction The interaction to defer the update for.
 * @returns The interaction response, or `undefined` if ignored due to an API error.
 */

export async function deferUpdate(
    interaction: MessageComponentInteraction | ModalSubmitInteraction
): Promise<InteractionResponse | undefined> {
    try {
        return await interaction.deferUpdate();
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
 * Sends a reply or follow-up message to an interaction.
 * Automatically determines whether to reply or follow up based on interaction state.
 *
 * @param interaction The interaction to respond to.
 * @param content Message content or options.
 * @param hidden Whether the message should be ephemeral.
 * @returns The sent message, or `undefined` if ignored due to an API error.
 */
export async function send(
    interaction: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
    content: string | EmbedBuilder | InteractionReplyOptions,
    hidden = false
): Promise<Message | InteractionCallbackResponse | undefined> {
    try {
        const options: InteractionReplyOptions =
            typeof content === 'string'
                ? { content }
                : content instanceof EmbedBuilder
                  ? { embeds: [content] }
                  : content;
        if (interaction.deferred || interaction.replied) {
            return await interaction.followUp({
                ...options,
                flags: hidden ? ['Ephemeral'] : undefined
            });
        } else {
            return await interaction.reply({
                ...options,
                flags: hidden ? ['Ephemeral'] : undefined,
                withResponse: true
            });
        }
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
 * Sends autocomplete choices in response to an autocomplete interaction.
 *
 * @param interaction The autocomplete interaction to respond to.
 * @param choices A list of choices to return.
 * @returns A void promise, or `undefined` if ignored due to a Discord API error.
 */
export async function respond(
    interaction: AutocompleteInteraction,
    choices: ApplicationCommandOptionChoiceData[] = []
): Promise<void> {
    try {
        return await interaction.respond(choices);
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
 * Edits the original reply to an interaction.
 *
 * @param interaction The interaction whose reply should be edited.
 * @param content New message content, embed, or edit options.
 * @returns A promise resolving to the edited message, or `undefined` if ignored.
 */
export async function editReply(
    interaction: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
    content: string | EmbedBuilder | WebhookMessageEditOptions
): Promise<Message | undefined> {
    try {
        const options: WebhookMessageEditOptions =
            typeof content === 'string'
                ? { content }
                : content instanceof EmbedBuilder
                  ? { embeds: [content] }
                  : content;
        return await interaction.editReply(options);
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
 * Updates the original message from a message component interaction.
 *
 * @param interaction The interaction to update.
 * @param content New content, embed, or full update options.
 * @returns A promise resolving to the updated interaction callback response, or `undefined` if ignored.
 */
export async function update(
    interaction: MessageComponentInteraction,
    content: string | EmbedBuilder | InteractionUpdateOptions
): Promise<InteractionCallbackResponse | undefined> {
    try {
        const options: InteractionUpdateOptions =
            typeof content === 'string'
                ? { content }
                : content instanceof EmbedBuilder
                  ? { embeds: [content] }
                  : content;
        return await interaction.update({
            ...options,
            withResponse: true
        });
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
