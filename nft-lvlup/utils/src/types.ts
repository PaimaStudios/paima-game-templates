import type { IGetUserCharactersResult } from '@game/db';

export interface InvalidInput {
  input: 'invalidString';
}

export const characters = ['air', 'earth', 'fire', 'water', 'ether'] as const;
export type CharacterType = typeof characters[number];

export interface OwnedCharactersResponse {
  characters: IGetUserCharactersResult[];
}
