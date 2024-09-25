
type VersionString = `${number}.${number}.${number}`;
const VERSION_MAJOR = 1;
const VERSION_MINOR = 1;
const VERSION_PATCH = 1;
export const gameBackendVersion: VersionString = `${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}`;
export const GAME_NAME = 'Midnight EVM';
export * from './types.js';
export type * from './types.js';
