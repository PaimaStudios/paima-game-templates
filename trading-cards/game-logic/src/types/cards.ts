/** Uniquely identifies a card owned by a player globally */
export type CardDbId = number;
/** Identifies type of card (e.g. 47 -> Queen of Spades) */
export type CardRegistryId = number;
/** Index in starting commitments, i.e. in starting deck */
export type CardCommitmentIndex = number;
/** The sequential position among all cards drawn in some match by some player */
export type DrawIndex = number;

export type CardDraw = {
  card: undefined | HandCard;
  newDeck: CardCommitmentIndex[];
};

export type LocalCard = {
  id: CardDbId;
  registryId: CardRegistryId;
  salt: string;
};
export type SerializedLocalCard = string;

export type HandCard = {
  index: CardCommitmentIndex;
  draw: DrawIndex;
};
export type SerializedHandCard = string;

export type BoardCard = {
  id: CardDbId;
  index: CardCommitmentIndex;
  registryId: CardRegistryId;
  // Note: If the game had something like health points on board cards, it should be implemented same as this.
  // A card has a constant amount of hp in the registry + buffs/modifiers, and one of them is missing hp.
  hasAttack: boolean;
};
export type SerializedBoardCard = string;

/**
 * List of cards and their properties.
 * This gets packaged into backend. It's a bad idea to store skins here.
 * Make a separate frontend registry instead.
 */
export type RegistryCard = {
  // recall: we're doing rock, paper, scissors
  defeats: CardRegistryId;
};
export type CardRegistry = Record<CardRegistryId, RegistryCard>;
