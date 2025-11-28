import { InfoOption } from '../../enums';
import { EventData } from '../../models';
import { DefaultLocale, EnabledLocales, Language } from '../../models/enum-helpers';
import { getEmbed, getRef } from '../../services';
import { send } from '../../utils';
import { Command, CommandDeferType } from '../command';
import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';

export class InfoCommand implements Command {
    public names = [getRef('chatCommands.info', DefaultLocale)];
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(interaction: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            option: interaction.options.getString(
                getRef('arguments.option', DefaultLocale)
            ) as InfoOption
        };

        let embed: EmbedBuilder;
        switch (args.option) {
            case InfoOption.ABOUT: {
                embed = getEmbed('displayEmbeds.about', data.language);
                break;
            }
            case InfoOption.TRANSLATE: {
                embed = getEmbed('displayEmbeds.translate', data.language);
                for (const languageCode of EnabledLocales) {
                    embed.addFields([
                        {
                            name: Language[languageCode].nativeName,
                            value: getRef('meta.translators', languageCode)
                        }
                    ]);
                }
                break;
            }
            default:
                return;
        }

        await send(interaction, embed);
    }
}
