import Config from '../../config/config.json';
import { DiscordAPIError } from 'discord.js';
import pino from 'pino';

let logger = pino(
    {
        formatters: {
            level: label => ({ level: label })
        }
    },
    Config.logging.pretty
        ? pino.transport({
              target: 'pino-pretty',
              options: {
                  colorize: true,
                  ignore: 'pid,hostname',
                  translateTime: 'yyyy-mm-dd HH:MM:ss.l'
              }
          })
        : undefined
);

let shardId: number;

export const Logger = {
    /**
     * Sets the current shard ID and includes it in all subsequent logs.
     *
     * @param id The shard ID to include in the logger context.
     */
    setShardId(id: number): void {
        if (shardId !== id) {
            shardId = id;
            logger = logger.child({ id });
        }
    },

    /**
     * Logs an informational message.
     *
     * @param message The message to log.
     * @param object An optional object to include in the log context.
     */
    info(message: string, object?: unknown): void {
        if (object !== undefined) {
            logger.info(object, message);
        } else {
            logger.info(message);
        }
    },

    /**
     * Logs a warning message.
     *
     * @param message The message to log.
     * @param object An optional object to include in the log context.
     */
    warn(message: string, object?: unknown): void {
        if (object !== undefined) {
            logger.warn(object, message);
        } else {
            logger.warn(message);
        }
    },

    /**
     * Logs an error message. Handles various types of error objects including:
     * - `string`: treated as additional error context.
     * - `Response`: fetch API response, logs relevant metadata.
     * - `DiscordAPIError`: logs details from discord.js error.
     * - Any other object: logged as-is with the message.
     *
     * @param message The error message to log.
     * @param object An optional object or error instance to include in the log.
     */
    async error(message: string, object?: unknown): Promise<void> {
        if (object === undefined) {
            logger.error(message);
            return;
        }

        if (typeof object === 'string') {
            logger.child({ message: object }).error(message);
        } else if (object instanceof Response) {
            let responseText = '';
            try {
                responseText = await object.text();
            } catch {
                // Ignore
            }

            logger
                .child({
                    path: object.url,
                    statusCode: object.status,
                    statusName: object.statusText,
                    headers: object.headers,
                    body: responseText
                })
                .error(message);
        } else if (object instanceof DiscordAPIError) {
            logger
                .child({
                    message: object.message,
                    code: object.code,
                    statusCode: object.status,
                    method: object.method,
                    url: object.url,
                    stack: object.stack
                })
                .error(message);
        } else {
            logger.error(object, message);
        }
    }
};
