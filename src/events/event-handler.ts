/**
 * Generic interface for event handlers in the application.
 *
 * Defines a contract for any class that processes a specific set of event arguments.
 *
 * @template T A tuple type representing the expected arguments for the `process` method.
 */
export interface EventHandler<T extends unknown[] = unknown[]> {
    /**
     * Processes the event with the given arguments.
     *
     * Implementers should define logic to handle the event context and execute side effects.
     *
     * @param args A spread of arguments representing the event data.
     * @returns A promise that resolves when event processing is complete.
     */
    process(...args: T): Promise<void>;
}
