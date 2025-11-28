/**
 * Returns a random integer between `min` and `max`, inclusive.
 *
 * @param min The minimum value (inclusive).
 * @param max The maximum value (inclusive).
 * @returns A randomly selected integer in the range [min, max].
 *
 * @example
 * randomIntFromInterval(1, 10); // Might return 7
 */
export function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Randomly shuffles the elements of an array using the Fisher-Yates algorithm.
 *
 * @param input The array to shuffle.
 * @returns A new array with elements in randomized order.
 *
 * @example
 * shuffle([1, 2, 3, 4]); // Might return [3, 1, 4, 2]
 */
export function shuffle<T>(input: T[]): T[] {
    for (let i = input.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [input[i], input[j]] = [input[j], input[i]];
    }
    return input;
}
