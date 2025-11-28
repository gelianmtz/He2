export interface Tag {
    tag: string;
    username: string;
    discriminator: string;
}

/**
 * Converts a string in the format `/pattern/flags` into a RegExp object.
 *
 * @param input The regex string in the format `/pattern/flags`.
 * @returns A RegExp object if parsing is successful, otherwise `undefined`.
 *
 * @example
 * regex("/hello/i"); // => /hello/i
 */
export function regex(input: string): RegExp | undefined {
    const match = input.match(/^\/(.*)\/([^/]*)$/);
    if (match == null) {
        return;
    }

    return new RegExp(match[1], match[2]);
}

/**
 * Escapes special characters in a string to safely use it in a regular expression.
 *
 * @param input The input string to escape.
 * @returns The escaped string safe for use in RegExp.
 *
 * @example
 * escapeRegex("hello.*"); // => "hello\\.\\*"
 */
export function escapeRegex(input: string): string {
    return input?.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Extracts a Discord user ID from a given string.
 *
 * @param input The string potentially containing a Discord ID.
 * @returns The first matching Discord ID (17 to 20 digits), or `undefined` if none found.
 *
 * @example
 * extractDiscordId("User: 123456789012345678"); // => "123456789012345678"
 */
export function extractDiscordId(input: string): string | undefined {
    return input?.match(/\b\d{17,20}\b/)?.[0];
}

/**
 * Parses a Discord tag string (e.g., `username#1234`) into its components.
 *
 * @param input The tag string to parse.
 * @returns An object containing `username`, `tag`, and `discriminator`, or `undefined` if invalid.
 *
 * @example
 * parseTag("cooluser#1234");
 * // => { tag: "cooluser#1234", username: "cooluser", discriminator: "1234" }
 */
export function parseTag(input: string): Tag | undefined {
    const match = input.match(/([^\s#]+)#(\d{4})/);
    if (match == null) {
        return;
    }

    return {
        tag: match[0],
        username: match[1],
        discriminator: match[2]
    };
}
