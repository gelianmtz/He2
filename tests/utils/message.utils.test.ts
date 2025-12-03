import { edit, erase, pin, react, reply, sendMessage, startThread } from '../../src/utils';
import {
    DiscordAPIError,
    RESTJSONErrorCodes as DiscordApiErrors,
    Message,
    TextBasedChannel
} from 'discord.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockMessage = {
    reply: vi.fn<() => Promise<string>>(),
    edit: vi.fn<() => Promise<string>>(),
    react: vi.fn<() => Promise<string>>(),
    pin: vi.fn<() => Promise<string>>(),
    unpin: vi.fn<() => Promise<string>>(),
    startThread: vi.fn<() => Promise<string>>(),
    delete: vi.fn<() => Promise<string>>()
};

const mockChannel = {
    send: vi.fn<() => Promise<string>>()
};

describe('Message utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('sendMessage', () => {
        it('sends a string message', async () => {
            mockChannel.send.mockResolvedValueOnce('sent-message');
            const result = await sendMessage(mockChannel as unknown as TextBasedChannel, 'hello');
            expect(result).toBe('sent-message');
            expect(mockChannel.send).toHaveBeenCalledWith({ content: 'hello' });
        });

        it('returns undefined on ignored error', async () => {
            const error = new DiscordAPIError(
                {
                    message: 'Not found',
                    code: DiscordApiErrors.UnknownMessage
                },
                DiscordApiErrors.UnknownMessage,
                404,
                'POST',
                '/channels/123/messages',
                { body: {}, files: [] }
            );
            mockChannel.send.mockRejectedValueOnce(error);

            const result = await sendMessage(mockChannel as unknown as TextBasedChannel, 'fail');
            expect(result).toBeUndefined();
        });
    });

    describe('reply', () => {
        it('replies to a message', async () => {
            mockMessage.reply.mockResolvedValueOnce('reply-msg');
            const result = await reply(mockMessage as unknown as Message, 'hi');
            expect(result).toBe('reply-msg');
            expect(mockMessage.reply).toHaveBeenCalledWith({ content: 'hi' });
        });
    });

    describe('edit', () => {
        it('edits a message', async () => {
            mockMessage.edit.mockResolvedValueOnce('edited');
            const result = await edit(mockMessage as unknown as Message, 'updated');
            expect(result).toBe('edited');
            expect(mockMessage.edit).toHaveBeenCalledWith({ content: 'updated' });
        });
    });

    describe('react', () => {
        it('adds a reaction', async () => {
            mockMessage.react.mockResolvedValueOnce('reaction');
            const result = await react(mockMessage as unknown as Message, '👍');
            expect(result).toBe('reaction');
            expect(mockMessage.react).toHaveBeenCalledWith('👍');
        });
    });

    describe('pin', () => {
        it('pins a message', async () => {
            mockMessage.pin.mockResolvedValueOnce('pinned');
            const result = await pin(mockMessage as unknown as Message);
            expect(result).toBe('pinned');
            expect(mockMessage.pin).toHaveBeenCalled();
        });

        it('unpins a message', async () => {
            mockMessage.unpin.mockResolvedValueOnce('unpinned');
            const result = await pin(mockMessage as unknown as Message, false);
            expect(result).toBe('unpinned');
            expect(mockMessage.unpin).toHaveBeenCalled();
        });
    });

    describe('startThread', () => {
        it('starts a thread', async () => {
            mockMessage.startThread.mockResolvedValueOnce('thread');
            const result = await startThread(mockMessage as unknown as Message, {
                name: 'thread-name'
            });
            expect(result).toBe('thread');
            expect(mockMessage.startThread).toHaveBeenCalledWith({ name: 'thread-name' });
        });
    });

    describe('erase', () => {
        it('deletes a message', async () => {
            mockMessage.delete.mockResolvedValueOnce('deleted');
            const result = await erase(mockMessage as unknown as Message);
            expect(result).toBe('deleted');
            expect(mockMessage.delete).toHaveBeenCalled();
        });
    });
});
