import { ActivityType, Client, Presence } from 'discord.js';

export type PresenceActivityType = Exclude<ActivityType, ActivityType.Custom>;

export class CustomClient extends Client {
    public setPresence(
        type: PresenceActivityType,
        name: string,
        url: string
    ): Presence | undefined {
        return this.user?.setPresence({
            activities: [
                {
                    type,
                    name,
                    url
                }
            ]
        });
    }
}
