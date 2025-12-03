import { EventData } from '../models';
import {
    ApplicationCommandOptionChoiceData,
    AutocompleteFocusedOption,
    AutocompleteInteraction,
    CommandInteraction,
    PermissionsString
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

/**
 * Interface representing a Discord slash command.
 */
export interface Command {
    /**
     * The names or aliases of the command.
     */
    names: string[];
    /**
     * Optional cooldown rate limiter to restrict how frequently the command can be used.
     */
    cooldown?: RateLimiter;
    /**
     * Determines the interaction response visibility.
     */
    deferType: CommandDeferType;
    /**
     * Permissions required by the bot to execute this command.
     */
    requireClientPerms: PermissionsString[];

    /**
     * Optional autocomplete handler for slash command options.
     * @param interaction The interaction context for autocomplete.
     * @param option The currently focused option.
     * @returns A list of possible choices for the focused option.
     */
    autocomplete?(
        interaction: AutocompleteInteraction,
        option: AutocompleteFocusedOption
    ): Promise<ApplicationCommandOptionChoiceData[]>;

    /**
     * Executes the command logic when invoked by a user.
     * @param interaction The interaction object representing the command invocation.
     * @param data Additional event-related data.
     */
    execute(interaction: CommandInteraction, data: EventData): Promise<void>;
}

/**
 * Enumeration for different defer behavior types when responding to interactions.
 */
export enum CommandDeferType {
    /**
     * Indicates the reply should be visible to everyone.
     */
    PUBLIC = 'PUBLIC',
    /**
     * Indicates the reply should only be visible to the command user.
     */
    HIDDEN = 'HIDDEN',
    /**
     * Indicates no defer behavior is used.
     */
    NONE = 'NONE'
}
