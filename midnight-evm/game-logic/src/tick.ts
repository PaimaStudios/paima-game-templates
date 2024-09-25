import type Prando from '@paima/sdk/prando';
import type { MatchState, MatchEnvironment, TickEvent } from './types';

// Executes a round executor tick and generates a tick event as a result
export function processTick(
  matchEnvironment: MatchEnvironment,
  matchState: MatchState,
  moves: any[],
  currentTick: number,
  __: Prando
): TickEvent[] | null {
  return [];
}

// Apply events to match state for the roundExecutor.
// In our case we only have a single event ever emitted in chess
// which simply updates the board state by mutating `matchState` directly.
function applyEvents(matchState: MatchState, event: TickEvent): void {}
