import { Controller } from '.';
import { Request, Response, Router } from 'express';

/**
 * A controller that handles requests to the root ("/") endpoint of the API.
 * Used to provide basic information about the API service.
 */
export class RootController implements Controller {
    public path = '/';
    public router = Router();

    public register(): void {
        this.router.get('/', (req, res) => this.get(req, res));
    }

    private async get(_request: Request, response: Response): Promise<void> {
        response.status(200).json({ name: 'Discord Bot Cluster API', author: 'Kevin Novak' });
    }
}
