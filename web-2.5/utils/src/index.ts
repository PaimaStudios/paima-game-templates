import { ENV } from '@paima/sdk/utils';

type VersionString = `${number}.${number}.${number}`;
const VERSION_MAJOR = 1;
const VERSION_MINOR = 1;
const VERSION_PATCH = 1;
export const gameBackendVersion: VersionString = `${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}`;
export const GAME_NAME = 'Generic Game';
export const PRACTICE_BOT_ADDRESS = '0x0101';

export * from './types.js';

// CONFIG VALUES
export class GameENV extends ENV {
  static get BATCHER_WALLET(): string {
    return process.env.BATCHER_WALLET || '';
  }
}
