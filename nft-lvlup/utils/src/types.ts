import type { IGetUserCharactersResult } from '@game/db';

export interface InvalidInput {
  input: 'invalidString';
}

// we have to re-specify this here because ABIs don't contain enums
// https://forum.soliditylang.org/t/reading-enum-values-directly-from-a-contract-with-js-ts-scripts/1155
export const characters = ['air', 'earth', 'fire', 'water', 'ether'] as const;
export type CharacterType = (typeof characters)[number];

export interface OwnedCharactersResponse {
  characters: IGetUserCharactersResult[];
}
