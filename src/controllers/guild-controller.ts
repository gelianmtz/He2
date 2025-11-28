import Config from '../../config/config.json';
import { GetGuildsResponse } from '../models/cluster-api';
import { Controller } from '.';
import { ShardingManager } from 'discord.js';
import { Request, Response, Router } from 'express';

/**
 * Controller responsible for handling guild-related API routes.
 */
export class GuildsController implements Controller {
    public path = '/guilds';
    public router = Router();
    public authToken = Config.api.secret;

    /**
     * Constructs a new instance of the `GuildsController`.
     * @param shardManager The ShardingManager instance to retrieve guild data from.
     */
    constructor(private shardManager: ShardingManager) {}

    /**
     * Registers all routes handled by this controller with the router.
     */
    public register(): void {
        this.router.get('/', async (req, res) => this.getGuilds(req, res));
    }

    /**
     * GET /guilds - Retrieves the IDs of all guilds across all shards.
     * @param request The Express request object.
     * @param response The Express response object.
     */
    private async getGuilds(_request: Request, response: Response): Promise<void> {
        const guilds: string[] = [
            ...new Set(
                (
                    await this.shardManager.broadcastEval(client => [...client.guilds.cache.keys()])
                ).flat()
            )
        ];

        const responseBody: GetGuildsResponse = {
            guilds
        };
        response.status(200).json(responseBody);
    }
}
