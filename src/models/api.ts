import Config from '../../config/config.json';
import Logs from '../../lang/logs.json';
import { Controller } from '../controllers';
import { checkAuth, handleError } from '../middleware';
import { Logger } from '../services/logger';
import express, { Express } from 'express';

/**
 * Represents the HTTP API server that registers controllers and handles incoming requests.
 */
export class Api {
    private app: Express;

    /**
     * Creates a new instance of the API server.
     * @param controllers Array of controllers to register with the API.
     */
    constructor(public controllers: Controller[]) {
        this.app = express();
        this.app.use(express.json());
        this.setupControllers();
        this.app.use(handleError());
    }

    /**
     * Starts the API server and listens on the configured port.
     * Logs a message when the server is successfully started.
     */
    public async start(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.app
                .listen(Config.api.port, () => {
                    Logger.info(
                        Logs.info.appStarted.replaceAll('{PORT}', Config.api.port.toString())
                    );
                    resolve();
                })
                .on('error', reject);
        });
    }

    /**
     * Registers each controller's routes and optional authentication middleware.
     */
    private setupControllers(): void {
        for (const controller of this.controllers) {
            if (controller.authToken !== undefined) {
                controller.router.use(checkAuth(controller.authToken));
            }
            controller.register();
            this.app.use(controller.path, controller.router);
        }
    }
}
