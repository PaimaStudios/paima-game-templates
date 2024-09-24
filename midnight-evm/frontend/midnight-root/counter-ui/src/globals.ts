import { Buffer } from 'buffer';

// @ts-expect-error: In this way we can tell graphql internals about environment it's used in
globalThis.process = {
  env: {
    NODE_ENV: import.meta.env.MODE,
  },
};

globalThis.Buffer = Buffer;
