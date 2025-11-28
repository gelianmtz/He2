import { EventData } from '../../models';
import { DefaultLocale } from '../../models/enum-helpers';
import { getEmbed, getRef } from '../../services';
import { send } from '../../utils';
import { Command, CommandDeferType } from '../command';
import { MessageContextMenuCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { DateTime } from 'luxon';

export class ViewDateSent implements Command {
    public names = [getRef('messageCommands.viewDateSent', DefaultLocale)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(
        interaction: MessageContextMenuCommandInteraction,
        data: EventData
    ): Promise<void> {
        await send(
            interaction,
            getEmbed('displayEmbeds.viewDateSent', data.language, {
                DATE: DateTime.fromJSDate(interaction.targetMessage.createdAt).toLocaleString(
                    DateTime.DATE_HUGE
                )
            })
        );
    }
}
