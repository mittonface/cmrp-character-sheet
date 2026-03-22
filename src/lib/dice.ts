import type { DiceExpression } from './types';

/** Roll a single die with the given number of sides */
function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/** Result of a dice roll */
export type RollResult = {
  expression: DiceExpression;
  rolls: number[]; // individual die results
  modifier: number;
  total: number;
};

/** Roll dice from a DiceExpression and return the full result */
export function roll(expr: DiceExpression): RollResult {
  const rolls = Array.from({ length: expr.count }, () => rollDie(expr.sides));
  const sum = rolls.reduce((a, b) => a + b, 0);
  const modifier = expr.modifier ?? 0;

  return {
    expression: expr,
    rolls,
    modifier,
    total: sum + modifier,
  };
}

/** Format a DiceExpression as a string: "2d6+3", "1d20-1", "1d20" */
export function formatDiceExpression(expr: DiceExpression): string {
  const base = `${expr.count}d${expr.sides}`;
  const mod = expr.modifier ?? 0;
  if (mod === 0) return base;
  return mod > 0 ? `${base}+${mod}` : `${base}${mod}`;
}

/** Format a RollResult for display */
export function formatRollResult(result: RollResult): string {
  const expr = formatDiceExpression(result.expression);
  const rolls = result.rolls.join(', ');
  return `${expr} → [${rolls}]${result.modifier ? ` ${result.modifier >= 0 ? '+' : ''}${result.modifier}` : ''} = ${result.total}`;
}
test;
