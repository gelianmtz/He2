import Config from '../../config/config.json';
import Debug from '../../config/debug.json';
import Logs from '../../lang/logs.json';
import {
    ButtonHandler,
    CommandHandler,
    GuildJoinHandler,
    GuildLeaveHandler,
    MessageHandler,
    ReactionHandler
} from '../events';
import { JobService, Logger } from '../services';
import { fillMessage, fillReaction, fillUser } from '../utils';
import {
    AutocompleteInteraction,
    ButtonInteraction,
    Client,
    CommandInteraction,
    Events,
    Guild,
    Interaction,
    Message,
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    RateLimitData,
    RESTEvents,
    User
} from 'discord.js';

/**
 * Represents the bot's main runtime behavior, including lifecycle,
 * event handling, and interaction with various handlers and services.
 */
export class Bot {
    private ready = false;

    /**
     * Creates an instance of the bot.
     * @param token Discord bot token used for login.
     * @param client discord.js client instance.
     * @param guildJoinHandler Handler for when the bot joins a guild.
     * @param guildLeaveHandler Handler for when the bot leaves a guild.
     * @param messageHandler Handler for message events.
     * @param commandHandler Handler for command and autocomplete interactions.
     * @param buttonHandler Handler for button interactions.
     * @param reactionHandler Handler for reaction events.
     * @param jobService Service to run background jobs (e.g., scheduling).
     */
    constructor(
        private token: string,
        private client: Client,
        private guildJoinHandler: GuildJoinHandler,
        private guildLeaveHandler: GuildLeaveHandler,
        private messageHandler: MessageHandler,
        private commandHandler: CommandHandler,
        private buttonHandler: ButtonHandler,
        private reactionHandler: ReactionHandler,
        private jobService: JobService
    ) {}

    /**
     * Starts the bot: registers all listeners and attempts to log in.
     */
    public async start(): Promise<void> {
        this.registerListeners();
        await this.login(this.token);
    }

    private registerListeners(): void {
        this.client.on(Events.ClientReady, () => this.onReady());
        this.client.on(Events.ShardReady, (shardId: number, unavailableGuilds?: Set<string>) =>
            this.onShardReady(shardId, unavailableGuilds)
        );
        this.client.on(Events.GuildCreate, guild => this.onGuildJoin(guild));
        this.client.on(Events.GuildDelete, guild => this.onGuildLeave(guild));
        this.client.on(Events.MessageCreate, msg => this.onMessage(msg));
        this.client.on(Events.InteractionCreate, intr => this.onInteraction(intr));
        this.client.on(
            Events.MessageReactionAdd,
            (messageReaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) =>
                this.onReaction(messageReaction, user)
        );
        this.client.rest.on(RESTEvents.RateLimited, (rateLimitData: RateLimitData) =>
            this.onRateLimit(rateLimitData)
        );
    }

    private async login(token: string): Promise<void> {
        try {
            await this.client.login(token);
        } catch (error) {
            Logger.error(Logs.error.clientLogin, error);
            return;
        }
    }

    private async onReady(): Promise<void> {
        const userTag = this.client.user?.tag;
        Logger.info(Logs.info.clientLogin.replaceAll('{USER_TAG}', userTag ?? ''));

        if (!Debug.dummyMode.enabled) {
            this.jobService.start();
        }

        this.ready = true;
        Logger.info(Logs.info.clientReady);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onShardReady(shardId: number, _unavailableGuilds?: Set<string>): void {
        Logger.setShardId(shardId);
    }

    private async onGuildJoin(guild: Guild): Promise<void> {
        if (!this.ready || Debug.dummyMode.enabled) {
            return;
        }

        try {
            await this.guildJoinHandler.process(guild);
        } catch (error) {
            Logger.error(Logs.error.guildJoin, error);
        }
    }

    private async onGuildLeave(guild: Guild): Promise<void> {
        if (!this.ready || Debug.dummyMode.enabled) {
            return;
        }

        try {
            await this.guildLeaveHandler.process(guild);
        } catch (error) {
            Logger.error(Logs.error.guildLeave, error);
        }
    }

    private async onMessage(message: Message): Promise<void> {
        if (
            !this.ready ||
            (Debug.dummyMode.enabled && !Debug.dummyMode.whitelist.includes(message.author.id))
        ) {
            return;
        }

        try {
            const fullMessage = await fillMessage(message);
            if (fullMessage === undefined) {
                return;
            }

            await this.messageHandler.process(message);
        } catch (error) {
            Logger.error(Logs.error.message, error);
        }
    }

    private async onInteraction(interaction: Interaction): Promise<void> {
        if (
            !this.ready ||
            (Debug.dummyMode.enabled && !Debug.dummyMode.whitelist.includes(interaction.user.id))
        ) {
            return;
        }

        if (
            interaction instanceof CommandInteraction ||
            interaction instanceof AutocompleteInteraction
        ) {
            try {
                await this.commandHandler.process(interaction);
            } catch (error) {
                Logger.error(Logs.error.command, error);
            }
        } else if (interaction instanceof ButtonInteraction) {
            try {
                await this.buttonHandler.process(interaction);
            } catch (error) {
                Logger.error(Logs.error.button, error);
            }
        }
    }

    private async onReaction(
        messageReaction: MessageReaction | PartialMessageReaction,
        reactor: User | PartialUser
    ): Promise<void> {
        if (
            !this.ready ||
            (Debug.dummyMode.enabled && !Debug.dummyMode.whitelist.includes(reactor.id))
        ) {
            return;
        }

        try {
            const fullMessageReaction = await fillReaction(messageReaction);
            if (fullMessageReaction === undefined) {
                return;
            }

            const fullReactor = await fillUser(reactor);
            if (fullReactor === undefined) {
                return;
            }

            await this.reactionHandler.process(
                fullMessageReaction,
                fullMessageReaction.message as Message,
                fullReactor
            );
        } catch (error) {
            Logger.error(Logs.error.reaction, error);
        }
    }

    private async onRateLimit(rateLimitData: RateLimitData): Promise<void> {
        if (rateLimitData.timeToReset >= Config.logging.rateLimit.minTimeout * 1000) {
            Logger.error(Logs.error.apiRateLimit, rateLimitData);
        }
    }
}
