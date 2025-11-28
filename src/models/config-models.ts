/**
 * Represents a bot listing site where server statistics are submitted.
 */
export interface BotSite {
    /** The display name of the bot site (used for logs or UI). */
    name: string;
    /** Whether the bot should send data to this site. */
    enabled: boolean;
    /** The URL endpoint where the server count should be posted. */
    url: string;
    /** Authorization token or header value required by the site. */
    authorization: string;
    /**
     * The HTTP request body template sent to the bot site.
     * Use `{{SERVER_COUNT}}` as a placeholder to be replaced dynamically.
     */
    body: string;
}
