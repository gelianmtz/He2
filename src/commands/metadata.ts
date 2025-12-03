import { DEV_COMMAND, HELP_OPTION, INFO_OPTION } from './args';
import { DefaultLocale } from '../models/enum-helpers';
import { getRef, getRefLocalizationMap } from '../services';
import {
    ApplicationCommandType,
    PermissionFlagsBits,
    PermissionsBitField,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody
} from 'discord.js';

export const ChatCommandMetadata: Record<string, RESTPostAPIChatInputApplicationCommandsJSONBody> =
    {
        DEV: {
            type: ApplicationCommandType.ChatInput,
            name: getRef('chatCommands.dev', DefaultLocale),
            name_localizations: getRefLocalizationMap('chatCommands.dev'),
            description: getRef('commandDescs.dev', DefaultLocale),
            description_localizations: getRefLocalizationMap('commandDescs.dev'),
            dm_permission: true,
            default_member_permissions: PermissionsBitField.resolve([
                PermissionFlagsBits.Administrator
            ]).toString(),
            options: [
                {
                    ...DEV_COMMAND,
                    required: true
                }
            ]
        },
        HELP: {
            type: ApplicationCommandType.ChatInput,
            name: getRef('chatCommands.help', DefaultLocale),
            name_localizations: getRefLocalizationMap('chatCommands.help'),
            description: getRef('commandDescs.help', DefaultLocale),
            description_localizations: getRefLocalizationMap('commandDescs.help'),
            dm_permission: true,
            default_member_permissions: undefined,
            options: [
                {
                    ...HELP_OPTION,
                    required: true
                }
            ]
        },
        INFO: {
            type: ApplicationCommandType.ChatInput,
            name: getRef('chatCommands.info', DefaultLocale),
            name_localizations: getRefLocalizationMap('chatCommands.info'),
            description: getRef('commandDescs.info', DefaultLocale),
            description_localizations: getRefLocalizationMap('commandDescs.info'),
            dm_permission: true,
            default_member_permissions: undefined,
            options: [
                {
                    ...INFO_OPTION,
                    required: true
                }
            ]
        },
        TEST: {
            type: ApplicationCommandType.ChatInput,
            name: getRef('chatCommands.test', DefaultLocale),
            name_localizations: getRefLocalizationMap('chatCommands.test'),
            description: getRef('commandDescs.test', DefaultLocale),
            description_localizations: getRefLocalizationMap('commandDescs.test'),
            dm_permission: true,
            default_member_permissions: undefined
        }
    };

export const MessageCommandMetadata: Record<
    string,
    RESTPostAPIContextMenuApplicationCommandsJSONBody
> = {
    VIEW_DATE_SENT: {
        type: ApplicationCommandType.Message,
        name: getRef('messageCommands.viewDateSent', DefaultLocale),
        name_localizations: getRefLocalizationMap('messageCommands.viewDateSent'),
        default_member_permissions: undefined,
        dm_permission: true
    }
};

export const UserCommandMetadata: Record<
    string,
    RESTPostAPIContextMenuApplicationCommandsJSONBody
> = {
    VIEW_DATE_JOINED: {
        type: ApplicationCommandType.User,
        name: getRef('userCommands.viewDateJoined', DefaultLocale),
        name_localizations: getRefLocalizationMap('userCommands.viewDateJoined'),
        default_member_permissions: undefined,
        dm_permission: true
    }
};
