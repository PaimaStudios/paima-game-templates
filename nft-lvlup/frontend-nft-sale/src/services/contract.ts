import { BrowserProvider, JsonRpcProvider } from 'ethers';
import type { JsonRpcSigner } from 'ethers';
import {
  TypedNativeNftSale__factory,
  TypedErc20NftSale__factory,
  AnnotatedMintNft__factory,
} from '../../../contracts/evm/typechain-types';
import {
  NATIVE_NFT_SALE_PROXY,
  CHAIN_URI,
  CHAIN_CURRENCY_DECIMALS,
  NFT,
  ERC20_NFT_SALE_PROXY,
} from './constants';
import type { CharacterType } from '@game/utils';
import { characterToNumberMap } from './utils';
import type { WalletMode } from '@paima/providers';
import { WalletModeMap } from '@paima/providers';

export type SignerProvider = BrowserProvider | JsonRpcProvider;

// we have to use a type alias because Vite requires isolatedModules which disallows const enums
const evmInjectedMode: WalletMode.EvmInjected = 0;

const DECIMALS = 10n ** BigInt(CHAIN_CURRENCY_DECIMALS);

const getPublicClient = (): JsonRpcProvider => {
  return new JsonRpcProvider(CHAIN_URI);
};
const getWalletClient = (_account: string): BrowserProvider => {
  const provider = new BrowserProvider(
    WalletModeMap[evmInjectedMode].getOrThrowProvider().getConnection().api
  );
  return provider;
};
export const getProvider = (account?: string): SignerProvider => {
  if (account) {
    return getWalletClient(account);
  }
  return getPublicClient();
};
export const getSigner = async (account: string): Promise<JsonRpcSigner> => {
  return await getWalletClient(account).getSigner();
};

export const buyNft = async (account: string, character: CharacterType) => {
  const nativeNftSaleProxyContract = await getNativeNftSaleProxyContract(account);
  const tokenPrice = await nativeNftSaleProxyContract.nftPrice();

  const provider = getProvider();
  // https://github.com/ethers-io/ethers.js/discussions/4219#discussioncomment-6375652
  const gasPrice = (await provider.getFeeData()).gasPrice;

  const characterNumber = characterToNumberMap[character];
  const tx = await nativeNftSaleProxyContract.buyNftType(account, characterNumber, {
    gasPrice,
    gasLimit: 800000,
    value: tokenPrice.toString(),
  });

  return tx;
};

const getNftContract = async (account: string) => {
  if (!NFT) {
    throw new Error(
      'NFT not set. Please fill in your .env file based on your contract deployment.'
    );
  }

  const signer = await getSigner(account);
  const contract = AnnotatedMintNft__factory.connect(NFT, signer);
  return contract;
};

const getNativeNftSaleProxyContract = async (account: string) => {
  if (!NATIVE_NFT_SALE_PROXY) {
    throw new Error(
      'NATIVE_NFT_SALE_PROXY not set. Please fill in your .env file based on your contract deployment.'
    );
  }

  const signer = await getSigner(account);
  const contract = TypedNativeNftSale__factory.connect(NATIVE_NFT_SALE_PROXY, signer);
  return contract;
};

const getNftSaleProxyContract = async (account: string) => {
  if (!ERC20_NFT_SALE_PROXY) {
    throw new Error(
      'ERC20_NFT_SALE_PROXY not set. Please fill in your .env file based on your contract deployment.'
    );
  }

  const signer = await getSigner(account);
  const contract = TypedErc20NftSale__factory.connect(ERC20_NFT_SALE_PROXY, signer);
  return contract;
};

export const getNftPrice = async (account: string) => {
  const nativeNftSaleProxyContract = await getNativeNftSaleProxyContract(account);
  const tokenPrice = await nativeNftSaleProxyContract.nftPrice();

  return (tokenPrice / DECIMALS).toString();
};

// ## admin functions section

export const withdrawNativeNftSaleFunds = async (account: string, recipientAddress: string) => {
  const nativeNftSaleProxyContract = await getNativeNftSaleProxyContract(account);
  const tx = await nativeNftSaleProxyContract.withdraw(recipientAddress, { gasLimit: 55000 });
  return tx;
};

export const updateNftPrice = async (account: string, newPrice: string) => {
  const nativeNftSaleProxyContract = await getNativeNftSaleProxyContract(account);
  const convertedPrice = BigInt(newPrice) * DECIMALS;
  const tx = await nativeNftSaleProxyContract.updatePrice(convertedPrice);
  return tx;
};

export const transferNativeNftSaleOwnership = async (account: string, newOwner: string) => {
  const nftContract = await getNativeNftSaleProxyContract(account);
  const tx = await nftContract.transferOwnership(newOwner);
  return tx;
};

export const updateBaseUri = async (account: string, newUri: string) => {
  const nftContract = await getNftContract(account);
  const tx = await nftContract.setBaseURI(newUri);
  return tx;
};

export const updateMaxSupply = async (account: string, newSupply: string) => {
  const nftContract = await getNftContract(account);
  const supply = BigInt(newSupply) * DECIMALS;
  const tx = await nftContract.updateMaxSupply(supply);
  return tx;
};

export const addMinter = async (account: string, newMinter: string) => {
  const nftContract = await getNftContract(account);
  const tx = await nftContract.setMinter(newMinter);
  return tx;
};

export const transferOwnership = async (account: string, newOwner: string) => {
  const nftContract = await getNftContract(account);
  const tx = await nftContract.transferOwnership(newOwner);
  return tx;
};

export const transferErc20NftSaleOwnership = async (account: string, newOwner: string) => {
  const nftContract = await getNftSaleProxyContract(account);
  const tx = await nftContract.transferOwnership(newOwner);
  return tx;
};

export const updateErc20NftPrice = async (account: string, newPrice: string) => {
  const nftContract = await getNftSaleProxyContract(account);
  const convertedPrice = BigInt(newPrice) * DECIMALS;
  const tx = await nftContract.updatePrice(convertedPrice);
  return tx;
};

export const withdrawErc20NftSaleFunds = async (account: string, recipientAddress: string) => {
  const nftContract = await getNftSaleProxyContract(account);
  const tx = await nftContract.withdraw(recipientAddress, { gasLimit: 55000 });
  return tx;
};
