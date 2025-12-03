import Config from '../../config/config.json';
import Logs from '../../lang/logs.json';
import { CustomClient } from '../extensions';
import { mapClass } from '../middleware';
import {
    GetShardsResponse,
    SetShardPresencesRequest,
    ShardInfo,
    ShardStats
} from '../models/cluster-api';
import { Logger } from '../services';
import { asActivityType } from '../utils';
import { Controller } from '.';
import { ShardingManager } from 'discord.js';
import { Request, Response, Router } from 'express';

/**
 * Controller responsible for handling shard-related endpoints.
 * Includes functionality to retrieve shard status and update shard presence.
 */
export class ShardsController implements Controller {
    public path = '/shards';
    public router = Router();
    public authToken: string = Config.api.secret;

    /**
     * Creates a new instance of the ShardsController.
     * @param shardManager The discord.js ShardingManager instance.
     */
    constructor(private shardManager: ShardingManager) {}

    public register(): void {
        this.router.get('/', (req, res) => this.getShards(req, res));
        this.router.put('/presence', mapClass(SetShardPresencesRequest), (req, res) =>
            this.setShardPresences(req, res)
        );
    }

    private async getShards(_request: Request, response: Response): Promise<void> {
        const shardDatas = await Promise.all(
            this.shardManager.shards.map(async shard => {
                const shardInfo: ShardInfo = {
                    id: shard.id,
                    ready: shard.ready,
                    error: false
                };

                try {
                    const uptime = (await shard.fetchClientValue('uptime')) as number;
                    shardInfo.uptimeSecs = Math.floor(uptime / 1000);
                } catch (error) {
                    Logger.error(Logs.error.managerShardInfo, error);
                    shardInfo.error = true;
                }

                return shardInfo;
            })
        );

        const stats: ShardStats = {
            shardCount: this.shardManager.shards.size,
            uptimeSecs: Math.floor(process.uptime())
        };
        const responseBody: GetShardsResponse = {
            shards: shardDatas,
            stats
        };

        response.status(200).json(responseBody);
    }

    private async setShardPresences(request: Request, response: Response): Promise<void> {
        const requestBody: SetShardPresencesRequest = response.locals.input;

        await this.shardManager.broadcastEval(
            (client, context) => {
                const customClient = client as CustomClient;
                return customClient.setPresence(
                    asActivityType(context.type),
                    context.name,
                    context.url
                );
            },
            {
                context: {
                    type: requestBody.type,
                    name: requestBody.name,
                    url: requestBody.url
                }
            }
        );

        response.sendStatus(200);
    }
}
