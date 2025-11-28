import { URL } from 'node:url';

/**
 * Service for making HTTP requests.
 */
export class HttpService {
    /**
     * Sends an HTTP GET request to the specified URL.
     *
     * @param url The target URL, as a string or `URL` object.
     * @param authorization Authorization token or credentials to include in the request headers.
     * @returns A `Promise` that resolves to the `Response` object.
     */
    public async get(url: string | URL, authorization: string): Promise<Response> {
        return await fetch(url.toString(), {
            method: 'get',
            headers: {
                Authorization: authorization,
                Accept: 'application/json'
            }
        });
    }

    /**
     * Sends an HTTP POST request to the specified URL with an optional JSON body.
     *
     * @param url The target URL, as a string or `URL` object.
     * @param authorization Authorization token or credentials to include in the request headers.
     * @param body Optional object to send as the JSON request body.
     * @returns A `Promise` that resolves to the `Response` object.
     */
    public async post(url: string | URL, authorization: string, body?: object): Promise<Response> {
        return await fetch(url.toString(), {
            method: 'post',
            headers: {
                Authorization: authorization,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });
    }

    /**
     * Sends an HTTP PUT request to the specified URL with an optional JSON body.
     *
     * @param url The target URL, as a string or `URL` object.
     * @param authorization Authorization token or credentials to include in the request headers.
     * @param body Optional object to send as the JSON request body.
     * @returns A `Promise` that resolves to the `Response` object.
     */
    public async put(url: string | URL, authorization: string, body?: object): Promise<Response> {
        return await fetch(url.toString(), {
            method: 'put',
            headers: {
                Authorization: authorization,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });
    }

    /**
     * Sends an HTTP DELETE request to the specified URL with an optional JSON body.
     *
     * @param url The target URL, as a string or `URL` object.
     * @param authorization Authorization token or credentials to include in the request headers.
     * @param body Optional object to send as the JSON request body.
     * @returns A `Promise` that resolves to the `Response` object.
     */
    public async delete(
        url: string | URL,
        authorization: string,
        body?: object
    ): Promise<Response> {
        return await fetch(url.toString(), {
            method: 'delete',
            headers: {
                Authorization: authorization,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });
    }
}
