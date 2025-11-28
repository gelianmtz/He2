import { GUILDS_PER_SHARD } from '../constants';
import { sum } from '.';
import { fetchRecommendedShardCount, ShardClientUtil, ShardingManager } from 'discord.js';

/**
 * Calculates the required number of shards based on Discord's recommendation
 * and the defined maximum number of guilds per shard.
 *
 * @param token The bot token used to fetch recommended shard count from Discord.
 * @returns The calculated number of required shards.
 */
export async function requiredShardCount(token: string): Promise<number> {
    return await recommendedShardCount(token, GUILDS_PER_SHARD);
}

/**
 * Calculates the recommended number of shards based on Discord's API
 * and a specified number of guilds per shard.
 *
 * @param token The bot token used to fetch the recommended shard count.
 * @param serversPerShard Maximum number of guilds per shard.
 * @returns The recommended number of shards.
 */
export async function recommendedShardCount(
    token: string,
    serversPerShard: number
): Promise<number> {
    return Math.ceil(await fetchRecommendedShardCount(token, { guildsPerShard: serversPerShard }));
}

/**
 * Gets the list of shard IDs from a sharding interface.
 *
 * @param shardInterface An instance of either `ShardingManager` or `ShardClientUtil`.
 * @returns An array of shard IDs, or `null` if the input type is invalid.
 */
export function getShardIds(shardInterface: ShardingManager | ShardClientUtil): number[] | null {
    if (shardInterface instanceof ShardingManager) {
        return shardInterface.shards.map(shard => shard.id);
    } else if (shardInterface instanceof ShardClientUtil) {
        return shardInterface.ids;
    } else {
        return null;
    }
}

/**
 * Computes the shard ID responsible for a given guild.
 *
 * @param guildId The ID of the guild.
 * @param shardCount Total number of shards.
 * @returns The shard ID responsible for the guild.
 *
 * @see {@link https://discord.com/developers/docs/topics/gateway#sharding-sharding-formula}
 */
export function shardId(guildId: number | string, shardCount: number): number {
    return Number((BigInt(guildId) >> 22n) % BigInt(shardCount));
}

/**
 * Retrieves the total number of guilds across all shards.
 *
 * @param shardInterface An instance of either `ShardingManager` or `ShardClientUtil`.
 * @returns The total number of guilds managed by the bot.
 */
export async function getServerCount(
    shardInterface: ShardingManager | ShardClientUtil
): Promise<number> {
    const shardGuildCounts = (await shardInterface.fetchClientValues(
        'guilds.cache.size'
    )) as number[];
    return sum(shardGuildCounts);
}
