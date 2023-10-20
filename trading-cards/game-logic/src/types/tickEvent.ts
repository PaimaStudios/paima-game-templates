import type { ValuesType } from 'utility-types';
import type { TICK_EVENT_KIND } from '../constants';
import type { BoardCard, CardDraw, ConciseResult, HandCard, Move } from '.';

export type TickEventKind = ValuesType<typeof TICK_EVENT_KIND>;

export type TxTickEvent = {
  kind: typeof TICK_EVENT_KIND.tx;
  move: Move;
};
export type PostTxTickEvent = {
  kind: typeof TICK_EVENT_KIND.postTx;
  draw: CardDraw;
};
export type PlayCardTickEvent = {
  kind: typeof TICK_EVENT_KIND.playCard;
  handPosition: number;
  newHand: HandCard[];
  newBoard: BoardCard[];
};
export type DestroyCardTickEvent = {
  kind: typeof TICK_EVENT_KIND.destroyCard;
  fromBoardPosition: number;
  toBoardPosition: number;
  newFromBoard: BoardCard[];
  newToBoard: BoardCard[];
};
export type TurnEndTickEvent = {
  kind: typeof TICK_EVENT_KIND.turnEnd;
  damageDealt: number;
};
export type RoundEndTickEvent = {
  kind: typeof TICK_EVENT_KIND.roundEnd;
};
export type MatchEndTickEvent = {
  kind: typeof TICK_EVENT_KIND.matchEnd;
  result: ConciseResult[];
};

export type TickEvent =
  | TxTickEvent
  | PostTxTickEvent
  | PlayCardTickEvent
  | DestroyCardTickEvent
  | TurnEndTickEvent
  | RoundEndTickEvent
  | MatchEndTickEvent;
