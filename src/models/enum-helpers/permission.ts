import { getRef } from '../../services';
import { Locale, PermissionsString } from 'discord.js';

interface PermissionData {
    displayName(languageCode: Locale): string;
}

export const Permission: Record<PermissionsString, PermissionData> = {
    AddReactions: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.AddReactions', languageCode);
        }
    },
    Administrator: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.Administrator', languageCode);
        }
    },
    AttachFiles: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.AttachFiles', languageCode);
        }
    },
    BanMembers: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.BanMembers', languageCode);
        }
    },
    BypassSlowmode: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.BypassSlowmode', languageCode);
        }
    },
    ChangeNickname: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ChangeNickname', languageCode);
        }
    },
    Connect: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.Connect', languageCode);
        }
    },
    CreateEvents: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.CreateEvents', languageCode);
        }
    },
    CreateGuildExpressions: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.CreateGuildExpressions', languageCode);
        }
    },
    CreateInstantInvite: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.CreateInstantInvite', languageCode);
        }
    },
    CreatePrivateThreads: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.CreatePrivateThreads', languageCode);
        }
    },
    CreatePublicThreads: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.CreatePublicThreads', languageCode);
        }
    },
    DeafenMembers: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.DeafenMembers', languageCode);
        }
    },
    EmbedLinks: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.EmbedLinks', languageCode);
        }
    },
    KickMembers: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.KickMembers', languageCode);
        }
    },
    ManageChannels: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ManageChannels', languageCode);
        }
    },
    ManageEmojisAndStickers: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ManageEmojisAndStickers', languageCode);
        }
    },
    ManageEvents: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ManageEvents', languageCode);
        }
    },
    ManageGuild: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ManageGuild', languageCode);
        }
    },
    ManageGuildExpressions: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ManageGuildExpressions', languageCode);
        }
    },
    ManageMessages: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ManageMessages', languageCode);
        }
    },
    ManageNicknames: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ManageNicknames', languageCode);
        }
    },
    ManageRoles: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ManageRoles', languageCode);
        }
    },
    ManageThreads: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ManageThreads', languageCode);
        }
    },
    ManageWebhooks: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ManageWebhooks', languageCode);
        }
    },
    MentionEveryone: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.MentionEveryone', languageCode);
        }
    },
    ModerateMembers: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ModerateMembers', languageCode);
        }
    },
    MoveMembers: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.MoveMembers', languageCode);
        }
    },
    MuteMembers: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.MuteMembers', languageCode);
        }
    },
    PinMessages: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.PinMessages', languageCode);
        }
    },
    PrioritySpeaker: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.PrioritySpeaker', languageCode);
        }
    },
    ReadMessageHistory: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ReadMessageHistory', languageCode);
        }
    },
    RequestToSpeak: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.RequestToSpeak', languageCode);
        }
    },
    SendMessages: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.SendMessages', languageCode);
        }
    },
    SendMessagesInThreads: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.SendMessagesInThreads', languageCode);
        }
    },
    SendPolls: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.SendPolls', languageCode);
        }
    },
    SendTTSMessages: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.SendTTSMessages', languageCode);
        }
    },
    SendVoiceMessages: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.SendVoiceMessages', languageCode);
        }
    },
    Speak: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.Speak', languageCode);
        }
    },
    Stream: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.Stream', languageCode);
        }
    },
    UseApplicationCommands: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.UseApplicationCommands', languageCode);
        }
    },
    UseEmbeddedActivities: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.UseEmbeddedActivities', languageCode);
        }
    },
    UseExternalApps: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.UseExternalApps', languageCode);
        }
    },
    UseExternalEmojis: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.UseExternalEmojis', languageCode);
        }
    },
    UseExternalSounds: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.UseExternalSounds', languageCode);
        }
    },
    UseExternalStickers: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.UseExternalStickers', languageCode);
        }
    },
    UseSoundboard: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.UseSoundboard', languageCode);
        }
    },
    UseVAD: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.UseVAD', languageCode);
        }
    },
    ViewAuditLog: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ViewAuditLog', languageCode);
        }
    },
    ViewChannel: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ViewChannel', languageCode);
        }
    },
    ViewCreatorMonetizationAnalytics: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ViewCreatorMonetizationAnalytics', languageCode);
        }
    },
    ViewGuildInsights: {
        displayName(languageCode: Locale): string {
            return getRef('permissions.ViewGuildInsights', languageCode);
        }
    }
};
