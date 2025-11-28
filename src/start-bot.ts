import { Button } from './buttons';
import {
    ChatCommandMetadata,
    Command,
    MessageCommandMetadata,
    UserCommandMetadata
} from './commands';
import { DevCommand, HelpCommand, InfoCommand, TestCommand } from './commands/chat';
import { ViewDateSent } from './commands/message';
import { ViewDateJoined } from './commands/user';
import {
    ButtonHandler,
    CommandHandler,
    GuildJoinHandler,
    GuildLeaveHandler,
    MessageHandler,
    ReactionHandler,
    TriggerHandler
} from './events';
import { CustomClient } from './extensions';
import { Job } from './jobs';
import { Bot } from './models';
import { Reaction } from './reactions';
import { CommandRegistrationService, EventDataService, JobService, Logger } from './services';
import { Trigger } from './triggers';
import Config from '../config/config.json';
import Logs from '../lang/logs.json';
import { GatewayIntentBits, Options, Partials, REST } from 'discord.js';

async function start(): Promise<void> {
    // Services
    const eventDataService = new EventDataService();

    // Client
    const client = new CustomClient({
        intents: Config.client.intents.map(
            intent => GatewayIntentBits[intent as keyof typeof GatewayIntentBits]
        ),
        partials: Config.client.partials.map(partial => Partials[partial as keyof typeof Partials]),
        makeCache: Options.cacheWithLimits({
            // Keep default caching behavior
            ...Options.DefaultMakeCacheSettings,
            // Override specific options from configuration
            ...Config.client.caches
        })
    });

    // Commands
    const commands: Command[] = [
        // Chat commands
        new DevCommand(),
        new HelpCommand(),
        new InfoCommand(),
        new TestCommand(),

        // Message context commands
        new ViewDateSent(),

        // User context commands
        new ViewDateJoined()
    ];

    // Buttons
    const buttons: Button[] = [];

    // Reactions
    const reactions: Reaction[] = [];

    // Triggers
    const triggers: Trigger[] = [];

    // Event handlers
    const guildJoinHandler = new GuildJoinHandler(eventDataService);
    const guildLeaveHandler = new GuildLeaveHandler();
    const commandHandler = new CommandHandler(commands, eventDataService);
    const buttonHandler = new ButtonHandler(buttons, eventDataService);
    const triggerHandler = new TriggerHandler(triggers, eventDataService);
    const messageHandler = new MessageHandler(triggerHandler);
    const reactionHandler = new ReactionHandler(reactions, eventDataService);

    // Jobs
    const jobs: Job[] = [];

    // Bot
    const bot = new Bot(
        Config.client.token,
        client,
        guildJoinHandler,
        guildLeaveHandler,
        messageHandler,
        commandHandler,
        buttonHandler,
        reactionHandler,
        new JobService(jobs)
    );

    // Register
    if (process.argv[2] === 'commands') {
        try {
            const rest = new REST({ version: '10' }).setToken(Config.client.token);
            const commandRegistrationService = new CommandRegistrationService(rest);
            const localCommands = [
                ...Object.values(ChatCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1)),
                ...Object.values(MessageCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1)),
                ...Object.values(UserCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1))
            ];
            await commandRegistrationService.process(localCommands, process.argv);
        } catch (error) {
            Logger.error(Logs.error.commandAction, error);
        }

        // Wait for any final logs to be written
        await new Promise(resolve => setTimeout(() => resolve, 1000));
        process.exit();
    }

    await bot.start();
}

process.on('unhandledRejection', reason => {
    Logger.error(Logs.error.unhandledRejection, reason);
});

start().catch(error => {
    Logger.error(Logs.error.unspecified, error);
});
