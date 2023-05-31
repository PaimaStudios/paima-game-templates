export const CHAIN_URI: string = process.env.CHAIN_URI ?? '';
export const CHAIN_EXPLORER_URI: string = process.env.CHAIN_EXPLORER_URI ?? '';
export const CHAIN_NAME: string = process.env.CHAIN_NAME ?? '';
export const CHAIN_ID: number = parseInt(process.env.CHAIN_ID ?? '200101');
export const CHAIN_CURRENCY_NAME: string = process.env.CHAIN_CURRENCY_SYMBOL ?? '';
export const CHAIN_CURRENCY_SYMBOL: string = process.env.CHAIN_CURRENCY_SYMBOL ?? '';
export const CHAIN_CURRENCY_DECIMALS: number = parseInt(
  process.env.CHAIN_CURRENCY_DECIMALS ?? '18'
);

if (!process.env.NATIVE_NFT_SALE_PROXY) {
  console.error(
    'NATIVE_NFT_SALE_PROXY is not set. Please fill in your .env file based on your contract deployment.'
  );
}
export const NATIVE_NFT_SALE_PROXY: string = process.env.NATIVE_NFT_SALE_PROXY ?? '';

// Contract address from the extensions.yml example, purely informational
export const NFT = '0xb1D0c3142Ef25d7A693bD60b6892a0Eea27eFAf0';
