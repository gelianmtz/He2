import { Command } from '../commands';
import { EventData } from '../models';
import { Permission } from '../models/enum-helpers';
import { getEmbed } from '../services';
import { duration, send } from '.';
import {
    CommandInteraction,
    GuildChannel,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    ThreadChannel
} from 'discord.js';

/**
 * Finds the most relevant command based on a sequence of command parts.
 *
 * This function filters the available commands by matching each part of the command name
 * step-by-step, returning the best match found.
 *
 * @param commands The list of available commands to search.
 * @param commandParts The parsed segments of the input command.
 * @returns The most relevant matching command, or `undefined` if none found.
 */
export function findCommand(commands: Command[], commandParts: string[]): Command | undefined {
    let found = [...commands];
    let closestMatch: Command | undefined;
    for (const [index, commandPart] of commandParts.entries()) {
        found = found.filter(command => command.names[index] === commandPart);
        switch (found.length) {
            case 0:
                return closestMatch;
            case 1:
                return found[0];
        }

        const exactMatch = found.find(command => command.names.length === index + 1);
        if (exactMatch) {
            closestMatch = exactMatch;
        }
    }
    return closestMatch;
}

/**
 * Runs validation checks for a command, including cooldowns and permission requirements.
 *
 * @param command The command to run checks for.
 * @param interaction The interaction that triggered the command.
 * @param data The contextual event data used for localization and formatting.
 * @returns A boolean indicating whether the command passed all checks (`true`) or failed (`false`).
 */
export async function runChecks(
    command: Command,
    interaction: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
    data: EventData
): Promise<boolean> {
    if (command.cooldown) {
        const limited = command.cooldown.take(interaction.user.id);
        if (limited) {
            await send(
                interaction,
                getEmbed('validationEmbeds.cooldownHit', data.language, {
                    AMOUNT: command.cooldown.amount.toLocaleString(data.language),
                    INTERVAL: duration(command.cooldown.interval, data.language)
                })
            );
            return false;
        }
    }

    if (
        (interaction.channel instanceof GuildChannel ||
            interaction.channel instanceof ThreadChannel) &&
        !interaction.channel
            .permissionsFor(interaction.client.user)
            ?.has(command.requireClientPerms)
    ) {
        await send(
            interaction,
            getEmbed('validationEmbeds.missingClientPerms', data.language, {
                PERMISSIONS: command.requireClientPerms
                    .map(perm => `**${Permission[perm].displayName(data.language)}**`)
                    .join(', ')
            })
        );
        return false;
    }

    return true;
}
