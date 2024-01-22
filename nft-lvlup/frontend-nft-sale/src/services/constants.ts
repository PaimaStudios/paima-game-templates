export const NETWORK: string = process.env.NETWORK ?? 'localhost';
export const CHAIN_URI: string = process.env.CHAIN_URI ?? '';
export const CHAIN_EXPLORER_URI: string = process.env.CHAIN_EXPLORER_URI ?? '';
export const CHAIN_NAME: string = process.env.CHAIN_NAME ?? '';
export const CHAIN_ID: number = parseInt(process.env.CHAIN_ID ?? '31337');
export const CHAIN_CURRENCY_NAME: string = process.env.CHAIN_CURRENCY_SYMBOL ?? '';
export const CHAIN_CURRENCY_SYMBOL: string = process.env.CHAIN_CURRENCY_SYMBOL ?? '';
export const CHAIN_CURRENCY_DECIMALS: number = parseInt(
  process.env.CHAIN_CURRENCY_DECIMALS ?? '18'
);

export const NATIVE_NFT_SALE_PROXY: string = process.env.NATIVE_NFT_SALE_PROXY ?? '';
export const ERC20_NFT_SALE_PROXY: string = process.env.ERC20_NFT_SALE_PROXY ?? '';
export const NFT: string = process.env.NFT ?? '';
