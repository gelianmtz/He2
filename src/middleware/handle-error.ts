import Logs from '../../lang/logs.json';
import { Logger } from '../services';
import { ErrorRequestHandler } from 'express';

export function handleError(): ErrorRequestHandler {
    return (error, req, res) => {
        Logger.error(
            Logs.error.apiRequest
                .replaceAll('{HTTP_METHOD}', req.method)
                .replaceAll('{URL}', req.url),
            error
        );
        res.status(500).json({ error: true, message: error.message });
    };
}
