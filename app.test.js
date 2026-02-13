const { formatDate } = require('./app');

describe('formatDate', () => {
    test('formats valid ISO date string to Polish format', () => {
        const result = formatDate('2025-01-01');
        // Match both 01.01.2025 and 1.01.2025 to be environment-agnostic
        expect(result).toMatch(/^(0?1)\.(0?1)\.2025$/);
    });

    test('formats date string with time', () => {
        const result = formatDate('2025-05-15T10:30:00');
        expect(result).toMatch(/^(15)\.(0?5)\.2025$/);
    });

    test('returns "-" for null or undefined', () => {
        expect(formatDate(null)).toBe('-');
        expect(formatDate(undefined)).toBe('-');
        expect(formatDate('')).toBe('-');
    });

    test('returns "-" for invalid date strings', () => {
        expect(formatDate('not-a-date')).toBe('-');
    });

    test('handles different months correctly', () => {
        const result = formatDate('2025-12-31');
        expect(result).toMatch(/^(31)\.(12)\.2025$/);
    });
});
