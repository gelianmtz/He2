import { Router } from 'express';

/**
 * Represents a controller for handling a specific route or set of routes.
 */
export interface Controller {
    /**
     * The base path at which this controller will handle requests.
     */
    path: string;
    /**
     * The Express router instance that defines the routes handled by this controller.
     */
    router: Router;
    /**
     * Authentication token required for access to this controller's routes.
     */
    authToken?: string;

    /**
     * Registers the controller's routes and middleware with the Express application or parent router.
     */
    register(): void;
}
