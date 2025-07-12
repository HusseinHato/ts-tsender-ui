import { describe, expect, it } from 'vitest';
import { calculateTotal } from './calculateTotal'; // Adjust the import path

describe('calculateTotal', () => {
  it('handles empty input', () => {
    expect(calculateTotal('')).toBe(0);
    expect(calculateTotal('0')).toBe(0);
  });

  it('handles single amount', () => {
    expect(calculateTotal('42')).toBe(42);
    expect(calculateTotal('3.14')).toBe(3.14);
  });

  it('sums multiple amounts with commas', () => {
    expect(calculateTotal('1, 2, 3')).toBe(6);
    expect(calculateTotal('10.5, 20.3, 30.2')).toBe(61);
  });

  it('sums multiple amounts with newlines', () => {
    expect(calculateTotal('1\n2\n3')).toBe(6);
    expect(calculateTotal('10.5\n20.3\n30.2')).toBe(61);
  });

  it('handles mixed commas and newlines', () => {
    expect(calculateTotal('1,2\n3')).toBe(6);
    expect(calculateTotal('10.5,20.3\n30.2')).toBe(61);
  });

  it('ignores empty entries and whitespace', () => {
    expect(calculateTotal('1, , 2\n\n3, ,')).toBe(6);
    expect(calculateTotal(' 5 ,  , 15 ')).toBe(20);
  });

  it('filters non-numeric values', () => {
    expect(calculateTotal('1, abc, 2, def, 3')).toBe(6);
    expect(calculateTotal('foo, 10.5, bar, 20.3')).toBe(30.8);
  });

  it('handles trailing/leading delimiters', () => {
    expect(calculateTotal(',1,2,3,')).toBe(6);
    expect(calculateTotal('\n1\n2\n3\n')).toBe(6);
  });

  it('handles large numbers', () => {
    expect(calculateTotal('1000000, 2000000')).toBe(3000000);
  });

  it('handles decimal precision', () => {
    expect(calculateTotal('0.1, 0.2')).toBeCloseTo(0.3);
    expect(calculateTotal('1.005, 2.003')).toBeCloseTo(3.008, 3);
  });
  it('should handle numbers mixed with text correctly', () => {
    // parseFloat('12three') actually returns 12, not NaN.
    // parseFloat('abc12') returns NaN.
    // parseFloat('123.45.67') returns 123.45 (stops at second decimal).
    expect(calculateTotal('12three\n45,abc12,123.45.67')).toBe(12 + 45 + 123.45); // 180.45
  });
});