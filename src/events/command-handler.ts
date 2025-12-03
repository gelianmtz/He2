import Config from '../../config/config.json';
import Logs from '../../lang/logs.json';
import { Command, CommandDeferType } from '../commands';
import { CHOICES_PER_AUTOCOMPLETE } from '../constants';
import { EventData } from '../models';
import { EventDataService, getEmbed, getRef, Logger } from '../services';
import { deferReply, findCommand, respond, runChecks, send } from '../utils';
import { EventHandler } from '.';
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    CommandInteraction,
    NewsChannel,
    TextChannel,
    ThreadChannel
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

/**
 * Handles command and autocomplete interactions from Discord.
 *
 * This class manages incoming slash commands and autocomplete interactions, applies rate limiting,
 * finds the appropriate command to execute, and handles defer/respond logic and error logging.
 */
export class CommandHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.commands.amount,
        Config.rateLimiting.commands.interval * 1000
    );

    /**
     * Creates a new instance of the command handler.
     *
     * @param commands The list of available commands to process.
     * @param eventDataService The service responsible for creating context data for events.
     */
    constructor(
        public commands: Command[],
        private eventDataService: EventDataService
    ) {}

    public async process(interaction: CommandInteraction | AutocompleteInteraction): Promise<void> {
        // Don't respond to self, or other bots
        if (interaction.user.id === interaction.client.user?.id || interaction.user.bot) {
            return;
        }

        const commandParts =
            interaction instanceof ChatInputCommandInteraction ||
            interaction instanceof AutocompleteInteraction
                ? [
                      interaction.commandName,
                      interaction.options.getSubcommandGroup(false),
                      interaction.options.getSubcommand(false)
                  ].filter(cmd => cmd != null)
                : [interaction.commandName];
        const commandName = commandParts.join(' ');

        // Try to find the command the user wants
        const command = findCommand(this.commands, commandParts);
        if (command === undefined) {
            Logger.error(
                Logs.error.commandNotFound
                    .replaceAll('{INTERACTION_ID}', interaction.id)
                    .replaceAll('{COMMAND_NAME}', commandName)
            );
            return;
        }

        if (interaction instanceof AutocompleteInteraction) {
            if (!command.autocomplete) {
                Logger.error(
                    Logs.error.autocompleteNotFound
                        .replaceAll('{INTERACTION_ID}', interaction.id)
                        .replaceAll('{COMMAND_NAME}', commandName)
                );
                return;
            }

            try {
                const option = interaction.options.getFocused(true);
                const choices = await command.autocomplete(interaction, option);
                await respond(interaction, choices?.slice(0, CHOICES_PER_AUTOCOMPLETE));
            } catch (error) {
                Logger.error(
                    interaction.channel instanceof TextChannel ||
                        interaction.channel instanceof NewsChannel ||
                        interaction.channel instanceof ThreadChannel
                        ? Logs.error.autocompleteGuild
                              .replaceAll('{INTERACTION_ID}', interaction.id)
                              .replaceAll('{OPTION_NAME}', commandName)
                              .replaceAll('{COMMAND_NAME}', commandName)
                              .replaceAll('{USER_TAG}', interaction.user.tag)
                              .replaceAll('{USER_ID}', interaction.user.id)
                              .replaceAll('{CHANNEL_NAME}', interaction.channel.name)
                              .replaceAll('{CHANNEL_ID}', interaction.channel.id)
                              .replaceAll('{GUILD_NAME}', interaction.guild?.name ?? '?')
                              .replaceAll('{GUILD_ID}', interaction.guild?.id ?? '?')
                        : Logs.error.autocompleteOther
                              .replaceAll('{INTERACTION_ID}', interaction.id)
                              .replaceAll('{OPTION_NAME}', commandName)
                              .replaceAll('{COMMAND_NAME}', commandName)
                              .replaceAll('{USER_TAG}', interaction.user.tag)
                              .replaceAll('{USER_ID}', interaction.user.id),
                    error
                );
            }
            return;
        }

        // Check if user is rate limited
        if (this.rateLimiter.take(interaction.user.id)) {
            return;
        }

        // Defer interaction
        // NOTE: Anything after this point we should be responding to the interaction
        switch (command.deferType) {
            case CommandDeferType.PUBLIC: {
                await deferReply(interaction, false);
                break;
            }
            case CommandDeferType.HIDDEN: {
                await deferReply(interaction, true);
                break;
            }
        }

        // Return if defer was unsuccessful
        if (command.deferType !== CommandDeferType.NONE && !interaction.deferred) {
            return;
        }

        // Get data from database
        const data = await this.eventDataService.create({
            user: interaction.user,
            channel: interaction.channel,
            guild: interaction.guild,
            args:
                interaction instanceof ChatInputCommandInteraction ? interaction.options : undefined
        });

        try {
            // Check if interaction passes command checks;
            if (await runChecks(command, interaction, data)) {
                // Execute the command
                await command.execute(interaction, data);
            }
        } catch (error) {
            await this.sendError(interaction, data);

            // Log command error
            Logger.error(
                interaction.channel instanceof TextChannel ||
                    interaction.channel instanceof NewsChannel ||
                    interaction.channel instanceof ThreadChannel
                    ? Logs.error.commandGuild
                          .replaceAll('{INTERACTION_ID}', interaction.id)
                          .replaceAll('{COMMAND_NAME}', commandName)
                          .replaceAll('{USER_TAG}', interaction.user.tag)
                          .replaceAll('{USER_ID}', interaction.user.id)
                          .replaceAll('{CHANNEL_NAME}', interaction.channel.name)
                          .replaceAll('{CHANNEL_ID}', interaction.channel.id)
                          .replaceAll('{GUILD_NAME}', interaction.guild?.name ?? '?')
                          .replaceAll('{GUILD_ID}', interaction.guild?.id ?? '?')
                    : Logs.error.commandOther
                          .replaceAll('{INTERACTION_ID}', interaction.id)
                          .replaceAll('{COMMAND_NAME}', commandName)
                          .replaceAll('{USER_TAG}', interaction.user.tag)
                          .replaceAll('{USER_ID}', interaction.user.id),
                error
            );
        }
    }

    private async sendError(interaction: CommandInteraction, data: EventData): Promise<void> {
        try {
            await send(
                interaction,
                getEmbed('errorEmbeds.command', data.language, {
                    ERROR_CODE: interaction.id,
                    GUILD_ID: interaction.guild?.id ?? getRef('other.na', data.language),
                    SHARD_ID: (interaction.guild?.shardId ?? 0).toString()
                })
            );
        } catch {
            // Ignore
        }
    }
}
