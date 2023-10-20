import type Prando from '@paima/sdk/prando';
import type {
  BoardCard,
  CardCommitmentIndex,
  CardRegistryId,
  HandCard,
  LocalCard,
  SerializedBoardCard,
  SerializedHandCard,
  SerializedLocalCard,
} from './types';
import { CARD_IDS, DECK_LENGTH, MOVE_KIND, PACK_LENGTH } from './constants';
import type { Move, SerializedMove } from './types/move';

/**
 * Generate Fisher-Yates shuffle of range 0 to size.
 */
export function genPermutation(size: number, randomnessGenerator: Prando): number[] {
  const result = Array.from(Array(size).keys());

  for (const i of Array.from(Array(size).keys())) {
    const currentIndex = size - 1 - i;
    const resultIndex = randomnessGenerator.nextInt(0, i);

    [result[currentIndex], result[resultIndex]] = [result[resultIndex], result[currentIndex]];
  }
  return result;
}

export function initialCurrentDeck(): CardCommitmentIndex[] {
  return Array.from(Array(DECK_LENGTH).keys());
}

export function genExistingCardId(randomnessGenerator: Prando): CardRegistryId {
  return CARD_IDS[randomnessGenerator.nextInt(0, CARD_IDS.length - 1)];
}

export function genBotDeck(randomnessGenerator: Prando): CardRegistryId[] {
  return initialCurrentDeck().map(() => {
    return genExistingCardId(randomnessGenerator);
  });
}

export function genCardPack(randomnessGenerator: Prando): CardRegistryId[] {
  return Array.from(Array(PACK_LENGTH).keys()).map(() => {
    return genExistingCardId(randomnessGenerator);
  });
}

/**
 * Structs in db throw errors when compiling, we have to serialize them.
 * Note: arrays are ok.
 */
const dbStructPropDelimiter = '+';

export function serializeHandCard(card: HandCard): SerializedHandCard {
  return [card.index.toString(), card.draw.toString()].join(dbStructPropDelimiter);
}

export function deserializeHandCard(card: SerializedHandCard): HandCard {
  const props = card.split(dbStructPropDelimiter);
  return {
    index: Number.parseInt(props[0]),
    draw: Number.parseInt(props[1]),
  };
}

export function serializeBoardCard(card: BoardCard): SerializedBoardCard {
  return [
    card.id.toString(),
    card.index.toString(),
    card.registryId.toString(),
    card.hasAttack ? '1' : '0',
  ].join(dbStructPropDelimiter);
}

export function deserializeBoardCard(card: SerializedBoardCard): BoardCard {
  const props = card.split(dbStructPropDelimiter);
  return {
    id: Number.parseInt(props[0]),
    index: Number.parseInt(props[1]),
    registryId: Number.parseInt(props[2]),
    hasAttack: props[3] === '1' ? true : false,
  };
}

export function serializeLocalCard(card: LocalCard): SerializedLocalCard {
  return [card.id.toString(), card.registryId.toString(), card.salt].join(dbStructPropDelimiter);
}

export function deserializeLocalCard(card: SerializedLocalCard): LocalCard {
  const props = card.split(dbStructPropDelimiter);
  return {
    id: Number.parseInt(props[0]),
    registryId: Number.parseInt(props[1]),
    salt: props[2],
  };
}

export function serializeMove(move: Move): SerializedMove {
  const props: String[] = [move.kind];

  if (move.kind === MOVE_KIND.playCard) {
    props.push(move.handPosition.toString());
    props.push(move.cardIndex.toString());
    props.push(move.cardId.toString());
    props.push(move.cardRegistryId.toString());
    props.push(move.salt);
  }

  if (move.kind === MOVE_KIND.targetCardWithBoardCard) {
    props.push(move.fromBoardPosition.toString());
    props.push(move.toBoardPosition.toString());
  }

  return props.join(dbStructPropDelimiter);
}

export function deserializeMove(move: SerializedMove): Move {
  const parts = move.split(dbStructPropDelimiter);

  if (parts[0] === MOVE_KIND.playCard) {
    return {
      kind: parts[0],
      handPosition: Number.parseInt(parts[1]),
      cardIndex: Number.parseInt(parts[2]),
      cardId: Number.parseInt(parts[3]),
      cardRegistryId: Number.parseInt(parts[4]),
      salt: parts[5],
    };
  }

  if (parts[0] === MOVE_KIND.targetCardWithBoardCard) {
    return {
      kind: parts[0],
      fromBoardPosition: Number.parseInt(parts[1]),
      toBoardPosition: Number.parseInt(parts[2]),
    };
  }

  if (parts[0] === MOVE_KIND.endTurn) {
    return {
      kind: parts[0],
    };
  }

  throw new Error(`deserializeMove: unknown kind`);
}
