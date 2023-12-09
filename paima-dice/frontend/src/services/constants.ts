export const CHAIN_URI: string = process.env.CHAIN_URI;
export const NATIVE_PROXY: string = process.env.NATIVE_PROXY;
export const NFT: string = process.env.NFT;

if (CHAIN_URI == null || NATIVE_PROXY == null || NFT == null)
  throw new Error("ERROR: Did you forget to fill out .env?");
