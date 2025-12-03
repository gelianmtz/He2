import { EventData } from '../../models';
import { DefaultLocale } from '../../models/enum-helpers';
import { getEmbed, getRef } from '../../services';
import { send } from '../../utils';
import { Command, CommandDeferType } from '../command';
import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

export class TestCommand implements Command {
    public names = [getRef('chatCommands.test', DefaultLocale)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(interaction: ChatInputCommandInteraction, data: EventData): Promise<void> {
        await send(interaction, getEmbed('displayEmbeds.test', data.language));
    }
}
