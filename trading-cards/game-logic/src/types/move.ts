import type { ValuesType } from 'utility-types';
import { MOVE_KIND } from '../constants';
import type { CardCommitmentIndex, CardDbId, CardRegistryId } from '../types';

export type MoveKind = ValuesType<typeof MOVE_KIND>;
export type Move =
  | {
      kind: 'end'; // typeof MOVE_KIND.endTurn;
    }
  | {
      kind: 'play'; // typeof MOVE_KIND.playCard;
      handPosition: number;
      cardIndex: CardCommitmentIndex;
      cardId: CardDbId;
      cardRegistryId: CardRegistryId;
      salt: string;
    }
  | {
      kind: 'targetB'; // typeof MOVE_KIND.targetCardWithBoardCard;
      fromBoardPosition: number; // own
      toBoardPosition: number; // opponent's
    };
export type SerializedMove = string;

for (const moveKind of Object.values(MOVE_KIND)) {
  // TODO: TSOA doesn't compile correctly if we use MOVE_KIND in the definition of Move.
  // We use the constants directly and at least statically check here that they are correct.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const move_kind_type_check: Move['kind'] = moveKind;
}
