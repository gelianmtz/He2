import Config from '../../config/config.json';
import {
    LoginClusterResponse,
    RegisterClusterRequest,
    RegisterClusterResponse
} from '../models/master-api';
import { HttpService } from '.';
import { URL } from 'node:url';

/**
 * Service responsible for communicating with the master API for cluster registration and status updates.
 */
export class MasterApiService {
    private clusterId!: string;

    /**
     * Constructs a new `MasterApiService`.
     * @param httpService The HTTP service used to make requests to the master API.
     */
    constructor(private httpService: HttpService) {}

    /**
     * Registers the cluster with the master API.
     * Sends information such as shard count and callback details.
     * Throws an error if the registration fails.
     */
    public async register(): Promise<void> {
        const requestBody: RegisterClusterRequest = {
            shardCount: Config.clustering.shardCount,
            callback: {
                url: Config.clustering.callbackUrl,
                token: Config.api.secret
            }
        };

        const response = await this.httpService.post(
            new URL('/clusters', Config.clustering.masterApi.url),
            Config.clustering.masterApi.token,
            requestBody
        );

        if (!response.ok) {
            throw response;
        }

        const responseBody = (await response.json()) as RegisterClusterResponse;
        this.clusterId = responseBody.id;
    }

    /**
     * Sends a login signal to the master API using the assigned cluster ID.
     * Must be called after `register()`.
     * @returns The login response data from the master API.
     * @throws An error if the request fails or if the cluster ID is not set.
     */
    public async login(): Promise<LoginClusterResponse> {
        const response = await this.httpService.put(
            new URL(`/clusters/${this.clusterId}/login`, Config.clustering.masterApi.url),
            Config.clustering.masterApi.token
        );

        if (!response.ok) {
            throw response;
        }

        return (await response.json()) as LoginClusterResponse;
    }

    /**
     * Notifies the master API that the cluster is ready.
     * Must be called after `register()`.
     * @throws An error if the request fails or if the cluster ID is not set.
     */
    public async ready(): Promise<void> {
        const response = await this.httpService.put(
            new URL(`/clusters/${this.clusterId}/ready`, Config.clustering.masterApi.url),
            Config.clustering.masterApi.token
        );

        if (!response.ok) {
            throw response;
        }
    }
}
