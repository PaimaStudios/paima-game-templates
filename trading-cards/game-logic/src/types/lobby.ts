import type { IGetLobbyByIdResult, IGetNewLobbiesByUserAndBlockHeightResult } from '@cards/db';
import type { PropertiesNonNullable } from '@cards/utils';
import type { BoardCard, HandCard, LocalCard, Move } from '.';

export type LobbyStatus = 'open' | 'active' | 'finished' | 'closed';

export type NewLobby = IGetNewLobbiesByUserAndBlockHeightResult;

export type ConciseResult = 'w' | 't' | 'l';
export type LobbyPlayer = {
  nftId: number;
  hitPoints: number;
  readonly startingCommitments: Uint8Array;
  currentDeck: number[]; // indices
  currentHand: HandCard[];
  currentBoard: BoardCard[];
  currentDraw: number;
  currentResult: undefined | ConciseResult;
  botLocalDeck: undefined | LocalCard[]; // only defined for bot player
  turn: undefined | number;
};

type LobbyStateProps = 'current_match' | 'current_round' | 'current_turn' | 'current_proper_round';
export type LobbyWithStateProps = Omit<IGetLobbyByIdResult, LobbyStateProps> &
  PropertiesNonNullable<Pick<IGetLobbyByIdResult, LobbyStateProps>>;

export interface LobbyState extends LobbyWithStateProps {
  roundSeed: string;
  players: LobbyPlayer[];
  txEventMove: undefined | Move;
}
