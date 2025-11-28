import { PresenceActivityType } from '../extensions';
import { ActivityType } from 'discord.js';

export function asActivityType(type: string): PresenceActivityType {
    return ActivityType[type as keyof typeof ActivityType] as PresenceActivityType;
}
