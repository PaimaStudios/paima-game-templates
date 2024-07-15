// Interface

interface PaimaMW {
  start: () => Promise<{
    wallet: string;
    game: {
      block_height: number;
      id: number;
      prize: number;
      stage: string;
      wallet: string;
    };
    tokens: {
      tokens: number;
      global: number;
    };
  }>;

  ai: (
    response: string,
    target: string,
    id: number
  ) => Promise<{
    success: true;
    stats: {
      response: string;
    };
  }>;
  game: (id: number) => Promise<{
    success: true;
    stats: {
      prize: number;
    };
  }>;
}
export const paima = (document as any).Paima as PaimaMW;

//
// MOCK Endpoints to develop frontend offline
//
// export const paima: PaimaMW = {
//   start: async (): Promise<{
//     wallet: string;
//     game: {
//       block_height: number;
//       id: number;
//       prize: number;
//       stage: string;
//       wallet: string;
//     };
//     tokens: {
//       tokens: number;
//       global: number;
//     };
//   }> => {
//     return {
//       wallet: '0x0',
//       game: {
//         block_height: 1,
//         id: 100,
//         prize: 1234,
//         stage: 'none',
//         wallet: '0x0',
//       },
//       tokens: {
//         tokens: 1810,
//         global: 12000,
//       },
//     };
//   },
//   ai: async (
//     response: string,
//     target: string,
//     id: number
//   ): Promise<{
//     success: true;
//     stats: {
//       response: string;
//     };
//   }> => {
//     return {
//       success: true,
//       stats: {
//         response:
//           'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//       },
//     };
//   },
//   game: async (
//     id: number
//   ): Promise<{
//     success: true;
//     stats: {
//       prize: number;
//     };
//   }> => {
//     return {
//       success: true,
//       stats: {
//         prize: 1986,
//       },
//     };
//   },
// };

