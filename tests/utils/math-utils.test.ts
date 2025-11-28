import { ceilToMultiple, clamp, range, sum } from '../../src/utils';
import { describe, expect, it } from 'vitest';

describe('Math utils', () => {
    describe('sum', () => {
        it('should correctly sum an array of numbers', () => {
            const input = [1, 2, 3, 4, 5];
            const result = sum(input);
            expect(result).toBe(15);
        });

        it('should return 0 for an empty array', () => {
            const result = sum([]);
            expect(result).toBe(0);
        });

        it('should handle negative numbers correctly', () => {
            const input = [-1, -2, 3, 4];
            const result = sum(input);
            expect(result).toBe(4);
        });
    });

    describe('clamp', () => {
        it('should return the input value when within range', () => {
            const result = clamp(5, 1, 10);
            expect(result).toBe(5);
        });

        it('should return the min value when input is too low', () => {
            const result = clamp(0, 1, 10);
            expect(result).toBe(1);
        });

        it('should return the max value when input is too high', () => {
            const result = clamp(15, 1, 10);
            expect(result).toBe(10);
        });

        it('should handle negative ranges correctly', () => {
            const result = clamp(-5, -10, -2);
            expect(result).toBe(-5);
        });
    });

    describe('range', () => {
        it('should create an array of sequential numbers from start', () => {
            const result = range(5, 3);
            expect(result).toEqual([5, 6, 7]);
        });

        it('should create an empty array when size is 0', () => {
            const result = range(10, 0);
            expect(result).toEqual([]);
        });

        it('should handle negative start values', () => {
            const result = range(-3, 4);
            expect(result).toEqual([-3, -2, -1, 0]);
        });
    });

    describe('ceilToMultiple', () => {
        it('should round up to the nearest multiple', () => {
            const result = ceilToMultiple(14, 5);
            expect(result).toBe(15);
        });

        it('should not change value already at multiple', () => {
            const result = ceilToMultiple(15, 5);
            expect(result).toBe(15);
        });

        it('should handle decimal inputs correctly', () => {
            const result = ceilToMultiple(10.5, 5);
            expect(result).toBe(15);
        });

        it('should handle negative values correctly', () => {
            const result = ceilToMultiple(-12, 5);
            expect(result).toBe(-10);
        });
    });
});
