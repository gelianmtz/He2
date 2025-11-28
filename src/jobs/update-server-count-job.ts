import { Job } from './job';
import BotSites from '../../config/bot-sites.json';
import Config from '../../config/config.json';
import Logs from '../../lang/logs.json';
import { CustomClient } from '../extensions';
import { BotSite } from '../models';
import { getCom, HttpService, Logger } from '../services';
import { getServerCount } from '../utils';
import { ActivityType, ShardingManager } from 'discord.js';

/**
 * Job that updates the bot's server count on supported bot listing sites
 * and sets a global presence with the updated count.
 */
export class UpdateServerCountJob extends Job {
    public name = 'Update Server Count';
    public schedule = Config.jobs.updateServerCount.schedule;
    public log = Config.jobs.updateServerCount.log;
    public runOnce = Config.jobs.updateServerCount.runOnce;
    public initialDelaySecs = Config.jobs.updateServerCount.initialDelaySecs;

    private botSites: BotSite[];

    /**
     * Creates an instance of the UpdateServerCountJob.
     * @param shardManager Discord ShardingManager used to control all shards.
     * @param httpService Service used to make HTTP requests.
     */
    constructor(
        private shardManager: ShardingManager,
        private httpService: HttpService
    ) {
        super();
        this.botSites = BotSites.filter(botSite => botSite.enabled);
    }

    /**
     * Executes the job: updates presence across all shards and
     * notifies external bot list services with the current server count.
     */
    public async run(): Promise<void> {
        const serverCount = await getServerCount(this.shardManager);

        const type = ActivityType.Streaming as ActivityType.Streaming;
        const name = `to ${serverCount.toLocaleString()} servers`;
        const url = getCom('links.stream');

        await this.shardManager.broadcastEval(
            (client, context) => {
                const customClient = client as CustomClient;
                return customClient.setPresence(context.type, context.name, context.url);
            },
            { context: { type, name, url } }
        );

        Logger.info(
            Logs.info.updatedServerCount.replaceAll('{SERVER_COUNT}', serverCount.toLocaleString())
        );

        for (const botSite of this.botSites) {
            try {
                const body = JSON.parse(
                    botSite.body.replaceAll('{{SERVER_COUNT}}', serverCount.toString())
                );
                const response = await this.httpService.post(
                    botSite.url,
                    botSite.authorization,
                    body
                );

                if (!response.ok) {
                    throw response;
                }
            } catch (error) {
                Logger.error(
                    Logs.error.updatedServerCountSite.replaceAll('{BOT_SITE}', botSite.name),
                    error
                );
                continue;
            }

            Logger.info(Logs.info.updatedServerCountSite.replaceAll('{BOT_SITE}', botSite.name));
        }
    }
}
