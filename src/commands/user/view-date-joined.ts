import { EventData } from '../../models';
import { DefaultLocale } from '../../models/enum-helpers';
import { getEmbed, getRef } from '../../services';
import { send } from '../../utils';
import { Command, CommandDeferType } from '../command';
import { DMChannel, PermissionsString, UserContextMenuCommandInteraction } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { DateTime } from 'luxon';

export class ViewDateJoined implements Command {
    public names = [getRef('userCommands.viewDateJoined', DefaultLocale)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(
        interaction: UserContextMenuCommandInteraction,
        data: EventData
    ): Promise<void> {
        let joinDate: Date;
        const member = await interaction.guild?.members.fetch(interaction.targetUser.id);
        if (!(interaction.channel instanceof DMChannel) && member?.joinedAt != null) {
            joinDate = member.joinedAt;
        } else {
            joinDate = interaction.targetUser.createdAt;
        }

        await send(
            interaction,
            getEmbed('displayEmbeds.viewDateJoined', data.language, {
                TARGET: interaction.targetUser.toString(),
                DATE: DateTime.fromJSDate(joinDate).toLocaleString(DateTime.DATE_HUGE)
            })
        );
    }
}
