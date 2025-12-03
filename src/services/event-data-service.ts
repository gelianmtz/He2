import { EventData } from '../models';
import { DefaultLocale, EnabledLocales } from '../models/enum-helpers';
import {
    Channel,
    CommandInteractionOptionResolver,
    Guild,
    PartialDMChannel,
    User
} from 'discord.js';

/**
 * Service responsible for creating and managing instances of `EventData`,
 * which encapsulates relevant context information such as language settings
 * for a command interaction or event.
 */
export class EventDataService {
    /**
     * Creates an `EventData` object using the provided context options.
     *
     * Determines both the event's and the guild's language preferences, falling back to defaults if necessary.
     *
     * @param options Optional parameters representing the Discord context where the event occurred.
     * @param options.user The user involved in the event (if available).
     * @param options.channel The channel in which the event occurred.
     * @param options.guild The guild (server) where the event occurred, used to determine language settings.
     * @param options.args The parsed interaction options for commands, excluding `getMessage` and `getFocused`.
     * @returns A promise that resolves to a new `EventData` instance.
     */
    public async create(
        options: {
            user?: User;
            channel?: Channel | PartialDMChannel | null;
            guild?: Guild | null;
            args?: Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>;
        } = {}
    ): Promise<EventData> {
        // Event language
        const language =
            options.guild?.preferredLocale && EnabledLocales.includes(options.guild.preferredLocale)
                ? options.guild.preferredLocale
                : DefaultLocale;

        // Guild language
        const languageGuild =
            options.guild?.preferredLocale && EnabledLocales.includes(options.guild.preferredLocale)
                ? options.guild.preferredLocale
                : DefaultLocale;

        return new EventData(language, languageGuild);
    }
}
