import { escapeRegex, extractDiscordId, parseTag, regex, Tag } from '../../src/utils';
import { describe, expect, it } from 'vitest';

describe('Regex utils', () => {
    describe('regex', () => {
        it('should return a valid RegExp object from a regex string', () => {
            const result = regex('/hello/i');
            expect(result).toBeInstanceOf(RegExp);
            expect(result?.test('HELLO')).toBe(true);
        });

        it('should return undefined for invalid regex format', () => {
            expect(regex('hello')).toBeUndefined();
            expect(regex('/unclosed')).toBeUndefined();
            expect(regex('invalid/flags/')).toBeUndefined();
        });
    });

    describe('escapeRegex', () => {
        it('should escape special regex characters', () => {
            const input = 'hello.*+?^${}()|[]\\';
            const expected = 'hello\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\';
            expect(escapeRegex(input)).toBe(expected);
        });

        it('should return the same string if no special characters', () => {
            const input = 'hello';
            expect(escapeRegex(input)).toBe('hello');
        });

        it('should handle empty string', () => {
            expect(escapeRegex('')).toBe('');
        });
    });

    describe('extractDiscordId', () => {
        it('should extract a valid Discord ID', () => {
            const input = 'Mention: <@123456789012345678>';
            expect(extractDiscordId(input)).toBe('123456789012345678');
        });

        it('should return undefined if no ID found', () => {
            const input = 'No ID here!';
            expect(extractDiscordId(input)).toBeUndefined();
        });

        it('should extract the first valid ID if multiple exist', () => {
            const input = 'IDs: 123456789012345678 and 987654321098765432';
            expect(extractDiscordId(input)).toBe('123456789012345678');
        });
    });

    describe('parseTag', () => {
        it('should parse a valid Discord tag', () => {
            const input = 'cooluser#1234';
            const result = parseTag(input) as Tag;
            expect(result).toEqual({
                tag: 'cooluser#1234',
                username: 'cooluser',
                discriminator: '1234'
            });
        });

        it('should return undefined for invalid tags', () => {
            expect(parseTag('invalidtag')).toBeUndefined();
            expect(parseTag('no#discrim')).toBeUndefined();
            expect(parseTag('user#12')).toBeUndefined();
        });

        it('should parse tag embedded in a sentence', () => {
            const input = 'Contact cooluser#1234 for help.';
            const result = parseTag(input) as Tag;
            expect(result.tag).toBe('cooluser#1234');
            expect(result.username).toBe('cooluser');
            expect(result.discriminator).toBe('1234');
        });
    });
});
