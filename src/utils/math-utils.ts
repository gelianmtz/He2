/**
 * Calculates the sum of an array of numbers.
 *
 * @param numbers An array of numbers to be summed.
 * @returns The sum of all numbers in the array.
 */
export function sum(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
}

/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param input The number to clamp.
 * @param min The minimum allowable value.
 * @param max The maximum allowable value.
 * @returns The clamped value between `min` and `max`.
 */
export function clamp(input: number, min: number, max: number): number {
    return Math.min(Math.max(input, min), max);
}

/**
 * Generates a range of numbers.
 *
 * @param start The starting number of the range.
 * @param size The number of elements in the range.
 * @returns An array containing a range of numbers starting from `start` with `size` elements.
 *
 * @example
 * range(3, 4); // => [3, 4, 5, 6]
 */
export function range(start: number, size: number): number[] {
    return [...Array(size).keys()].map(i => i + start);
}

/**
 * Rounds a number up to the nearest multiple of another number.
 *
 * @param input The number to round.
 * @param multiple The multiple to round up to.
 * @returns The smallest multiple of `multiple` greater than or equal to `input`.
 *
 * @example
 * ceilToMultiple(7, 4); // => 8
 */
export function ceilToMultiple(input: number, multiple: number): number {
    return Math.ceil(input / multiple) * multiple;
}
