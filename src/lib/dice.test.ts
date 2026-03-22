import { describe, it, expect, vi } from 'vitest';
import { roll, formatDiceExpression, formatRollResult } from './dice';
import type { DiceExpression } from './types';

describe('roll', () => {
  it('returns the correct number of individual rolls', () => {
    const result = roll({ count: 3, sides: 6 });
    expect(result.rolls).toHaveLength(3);
  });

  it('all rolls are within valid range', () => {
    for (let i = 0; i < 100; i++) {
      const result = roll({ count: 1, sides: 20 });
      expect(result.rolls[0]).toBeGreaterThanOrEqual(1);
      expect(result.rolls[0]).toBeLessThanOrEqual(20);
    }
  });

  it('total equals sum of rolls plus modifier', () => {
    const result = roll({ count: 2, sides: 6, modifier: 3 });
    const sum = result.rolls.reduce((a, b) => a + b, 0);
    expect(result.total).toBe(sum + 3);
  });

  it('total equals sum of rolls when no modifier', () => {
    const result = roll({ count: 2, sides: 6 });
    const sum = result.rolls.reduce((a, b) => a + b, 0);
    expect(result.total).toBe(sum);
  });

  it('handles negative modifiers', () => {
    const result = roll({ count: 1, sides: 6, modifier: -2 });
    const sum = result.rolls[0];
    expect(result.total).toBe(sum - 2);
  });

  it('returns the original expression', () => {
    const expr: DiceExpression = { count: 2, sides: 8, modifier: 1 };
    const result = roll(expr);
    expect(result.expression).toBe(expr);
  });

  it('modifier field defaults to 0 when expression has no modifier', () => {
    const result = roll({ count: 1, sides: 6 });
    expect(result.modifier).toBe(0);
  });

  it('produces a deterministic result when Math.random is mocked', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = roll({ count: 2, sides: 6 });
    // Math.floor(0.5 * 6) + 1 = 4
    expect(result.rolls).toEqual([4, 4]);
    expect(result.total).toBe(8);
    vi.restoreAllMocks();
  });

  it('handles single die roll', () => {
    const result = roll({ count: 1, sides: 4 });
    expect(result.rolls).toHaveLength(1);
    expect(result.rolls[0]).toBeGreaterThanOrEqual(1);
    expect(result.rolls[0]).toBeLessThanOrEqual(4);
  });
});

describe('formatDiceExpression', () => {
  it('formats basic expression without modifier', () => {
    expect(formatDiceExpression({ count: 1, sides: 20 })).toBe('1d20');
  });

  it('formats expression with positive modifier', () => {
    expect(formatDiceExpression({ count: 2, sides: 6, modifier: 3 })).toBe(
      '2d6+3',
    );
  });

  it('formats expression with negative modifier', () => {
    expect(formatDiceExpression({ count: 1, sides: 20, modifier: -1 })).toBe(
      '1d20-1',
    );
  });

  it('formats expression with zero modifier as no modifier', () => {
    expect(formatDiceExpression({ count: 1, sides: 20, modifier: 0 })).toBe(
      '1d20',
    );
  });

  it('formats expression with undefined modifier as no modifier', () => {
    expect(formatDiceExpression({ count: 3, sides: 8 })).toBe('3d8');
  });
});

describe('formatRollResult', () => {
  it('formats a simple roll result', () => {
    const result = {
      expression: { count: 1, sides: 20 },
      rolls: [15],
      modifier: 0,
      total: 15,
    };
    expect(formatRollResult(result)).toBe('1d20 → [15] = 15');
  });

  it('formats a roll result with positive modifier', () => {
    const result = {
      expression: { count: 2, sides: 6, modifier: 3 },
      rolls: [4, 5],
      modifier: 3,
      total: 12,
    };
    expect(formatRollResult(result)).toBe('2d6+3 → [4, 5] +3 = 12');
  });

  it('formats a roll result with negative modifier', () => {
    const result = {
      expression: { count: 1, sides: 20, modifier: -2 },
      rolls: [18],
      modifier: -2,
      total: 16,
    };
    expect(formatRollResult(result)).toBe('1d20-2 → [18] -2 = 16');
  });

  it('formats a multi-die roll with no modifier', () => {
    const result = {
      expression: { count: 3, sides: 6 },
      rolls: [2, 4, 6],
      modifier: 0,
      total: 12,
    };
    expect(formatRollResult(result)).toBe('3d6 → [2, 4, 6] = 12');
  });
});
