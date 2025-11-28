import { DevCommandName, HelpOption, InfoOption } from '../enums';
import { DefaultLocale } from '../models/enum-helpers';
import { getRef, getRefLocalizationMap } from '../services';
import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord.js';

export const DEV_COMMAND: APIApplicationCommandBasicOption = {
    name: getRef('arguments.command', DefaultLocale),
    name_localizations: getRefLocalizationMap('arguments.command'),
    description: getRef('argDescs.devCommand', DefaultLocale),
    description_localizations: getRefLocalizationMap('argDescs.devCommand'),
    type: ApplicationCommandOptionType.String,
    choices: [
        {
            name: getRef('devCommandNames.info', DefaultLocale),
            name_localizations: getRefLocalizationMap('devCommandNames.info'),
            value: DevCommandName.INFO
        }
    ]
};

export const HELP_OPTION: APIApplicationCommandBasicOption = {
    name: getRef('arguments.option', DefaultLocale),
    name_localizations: getRefLocalizationMap('arguments.option'),
    description: getRef('argDescs.helpOption', DefaultLocale),
    description_localizations: getRefLocalizationMap('argDescs.helpOption'),
    type: ApplicationCommandOptionType.String,
    choices: [
        {
            name: getRef('helpOptionDescs.contactSupport', DefaultLocale),
            name_localizations: getRefLocalizationMap('helpOptionDescs.contactSupport'),
            value: HelpOption.CONTACT_SUPPORT
        },
        {
            name: getRef('helpOptionDescs.commands', DefaultLocale),
            name_localizations: getRefLocalizationMap('helpOptionDescs.commands'),
            value: HelpOption.COMMANDS
        }
    ]
};

export const INFO_OPTION: APIApplicationCommandBasicOption = {
    name: getRef('arguments.option', DefaultLocale),
    name_localizations: getRefLocalizationMap('arguments.option'),
    description: getRef('argDescs.helpOption', DefaultLocale),
    description_localizations: getRefLocalizationMap('argDescs.helpOption'),
    type: ApplicationCommandOptionType.String,
    choices: [
        {
            name: getRef('infoOptions.about', DefaultLocale),
            name_localizations: getRefLocalizationMap('infoOptions.about'),
            value: InfoOption.ABOUT
        },
        {
            name: getRef('infoOptions.translate', DefaultLocale),
            name_localizations: getRefLocalizationMap('infoOptions.translate'),
            value: InfoOption.TRANSLATE
        }
    ]
};
