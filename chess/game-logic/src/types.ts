import type { Color } from 'chess.js';

export interface TickEvent {
  user: string;
  pgn_move: string;
}

export interface MatchEnvironment {
  user1: PlayerInfo;
  user2: PlayerInfo;
}

export interface PlayerInfo {
  wallet: string;
  color: Color;
}

export interface MatchState {
  fenBoard: string;
}

export type MatchMove = string;
