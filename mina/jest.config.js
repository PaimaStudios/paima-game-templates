const ignorePaths = ['/node_modules/', '/build/', '/integration-testing/'];

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  verbose: true,
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [...ignorePaths],
  testPathIgnorePatterns: [...ignorePaths],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/jestSetup.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js'],
  resolver: '<rootDir>/contracts/mina/jest-resolver.cjs',
  testTimeout: 1_000_000,
};
