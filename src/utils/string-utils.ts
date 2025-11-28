import { escapeMarkdown as escapeMd } from 'discord.js';
import removeMd from 'remove-markdown';

/**
 * Truncates a string to the specified length, optionally adding an ellipsis (`...`) at the end.
 *
 * @param input The input string to truncate.
 * @param length The maximum length of the returned string. If `addEllipsis` is `true`, the ellipsis is included in this length.
 * @param addEllipsis Whether to append `...` at the end of the truncated string. Defaults to `false`.
 * @returns The truncated string, with or without ellipsis.
 */
export function truncate(input: string, length: number, addEllipsis = false): string {
    if (input.length <= length) {
        return input;
    }

    let output = input.substring(0, addEllipsis ? length - 3 : length);
    if (addEllipsis) {
        output += '...';
    }

    return output;
}

/**
 * Escapes Markdown syntax in a string to prevent formatting in Discord messages.
 * Also reverts escaping inside custom Discord emojis to preserve their format.
 *
 * @param input The input string containing Markdown or Discord formatting.
 * @returns The input string with Markdown escaped, except inside custom emoji tags.
 */
export function escapeMarkdown(input: string): string {
    return escapeMd(input).replaceAll(
        /<(a?):(\S+):(\d{17,20})>/g,
        (_, animatedPrefix, emojiName, emojiId) => {
            const emojiNameUnescaped = emojiName.replaceAll(/\\/g, '');
            return `<${animatedPrefix}:${emojiNameUnescaped}:${emojiId}>`;
        }
    );
}

/**
 * Removes all Markdown syntax from a string, returning plain text.
 *
 * @param input The input string with Markdown formatting.
 * @returns The string with all Markdown removed.
 */
export function removeMarkdown(input: string): string {
    return removeMd(input);
}
