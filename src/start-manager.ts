import { GuildsController, RootController, ShardsController } from './controllers';
import { UpdateServerCountJob } from './jobs';
import { Api, Manager } from './models';
import { HttpService, JobService, Logger, MasterApiService } from './services';
import { range, recommendedShardCount, requiredShardCount } from './utils';
import Config from '../config/config.json';
import Debug from '../config/debug.json';
import Logs from '../lang/logs.json';
import { ShardingManager, ShardingManagerMode } from 'discord.js';

async function start(): Promise<void> {
    Logger.info(Logs.info.appStarted);

    // Dependencies
    const httpService = new HttpService();
    const masterApiService = new MasterApiService(httpService);
    if (Config.clustering.enabled) {
        await masterApiService.register();
    }

    // Sharding
    let shardList: number[];
    let totalShards: number;
    try {
        if (Config.clustering.enabled) {
            const responseBody = await masterApiService.login();
            shardList = responseBody.shardList;
            const requiredShards = await requiredShardCount(Config.client.token);
            totalShards = Math.max(requiredShards, responseBody.totalShards);
        } else {
            const recommendedShards = await recommendedShardCount(
                Config.client.token,
                Config.sharding.serversPerShard
            );
            shardList = range(0, recommendedShards);
            totalShards = recommendedShards;
        }
    } catch (error) {
        Logger.error(Logs.error.retrieveShards, error);
        return;
    }

    if (shardList.length === 0) {
        Logger.warn(Logs.warn.managerNoShards);
        return;
    }

    const shardManager = new ShardingManager('dist/start-bot.js', {
        token: Config.client.token,
        mode: Debug.override.shardMode.enabled
            ? (Debug.override.shardMode.value as ShardingManagerMode)
            : 'process',
        respawn: true,
        totalShards,
        shardList
    });

    // Jobs
    const jobs = [
        Config.clustering.enabled ? undefined : new UpdateServerCountJob(shardManager, httpService)
    ].filter(job => job != null);

    const manager = new Manager(shardManager, new JobService(jobs));

    // API
    const guildsController = new GuildsController(shardManager);
    const shardsController = new ShardsController(shardManager);
    const rootController = new RootController();
    const api = new Api([guildsController, shardsController, rootController]);

    // Start
    await manager.start();
    await api.start();
    if (Config.clustering.enabled) {
        masterApiService.ready();
    }
}

process.on('unhandledRejection', reason => {
    Logger.error(Logs.error.unhandledRejection, reason);
});

start().catch(error => {
    Logger.error(Logs.error.unspecified, error);
});
