import type { Signer } from '@ethersproject/abstract-signer';
import { BigNumber, providers } from 'ethers';
import { NativeNftSale__factory, NftSale__factory, NFT__factory } from '../typechain';
import {
  NATIVE_NFT_SALE_PROXY,
  CHAIN_URI,
  CHAIN_CURRENCY_DECIMALS,
  NFT,
  NFT_SALE_PROXY,
} from './constants';
import type { Characters } from './utils';
import { characterToNumberMap } from './utils';

export type SignerProvider = Signer | providers.Provider;

const DECIMALS = BigNumber.from(10).pow(CHAIN_CURRENCY_DECIMALS);

export const getSignerOrProvider = (account?: string): SignerProvider => {
  if (account) {
    const provider = new providers.Web3Provider((window as any).ethereum);
    return provider.getSigner();
  }

  return new providers.JsonRpcProvider(CHAIN_URI);
};

export const buyNft = async (account: string, character: Characters) => {
  const nativeNftSaleProxyContract = getNativeNftSaleProxyContract(account);
  const tokenPrice = await nativeNftSaleProxyContract.nftPrice();

  const provider = getSignerOrProvider();
  const gasPrice = await provider.getGasPrice();

  const characterNumber = characterToNumberMap[character];
  const tx = await nativeNftSaleProxyContract.buyNft(account, characterNumber, {
    gasPrice,
    gasLimit: 800000,
    value: tokenPrice.toString(),
  });

  return tx;
};

const getNftContract = (account: string) => {
  if (!NFT) {
    throw new Error(
      'NFT not set. Please fill in your .env file based on your contract deployment.'
    );
  }

  const signer = getSignerOrProvider(account);
  const contract = NFT__factory.connect(NFT, signer);
  return contract;
};

const getNativeNftSaleProxyContract = (account: string) => {
  if (!NATIVE_NFT_SALE_PROXY) {
    throw new Error(
      'NATIVE_NFT_SALE_PROXY not set. Please fill in your .env file based on your contract deployment.'
    );
  }

  const signer = getSignerOrProvider(account);
  const contract = NativeNftSale__factory.connect(NATIVE_NFT_SALE_PROXY, signer);
  return contract;
};

const getNftSaleProxyContract = (account: string) => {
  if (!NFT_SALE_PROXY) {
    throw new Error(
      'NFT_SALE_PROXY not set. Please fill in your .env file based on your contract deployment.'
    );
  }

  const signer = getSignerOrProvider(account);
  const contract = NftSale__factory.connect(NFT_SALE_PROXY, signer);
  return contract;
};

export const getNftPrice = async (account: string) => {
  const nativeNftSaleProxyContract = getNativeNftSaleProxyContract(account);
  const tokenPrice = await nativeNftSaleProxyContract.nftPrice();

  return tokenPrice.div(DECIMALS).toString();
};

// ## admin functions section

export const withdrawNativeNftSaleFunds = async (account: string, recipientAddress: string) => {
  const nativeNftSaleProxyContract = getNativeNftSaleProxyContract(account);
  const tx = await nativeNftSaleProxyContract.withdraw(recipientAddress, { gasLimit: 55000 });
  return tx;
};

export const updateNftPrice = async (account: string, newPrice: string) => {
  const nativeNftSaleProxyContract = getNativeNftSaleProxyContract(account);
  const convertedPrice = BigNumber.from(newPrice).mul(DECIMALS);
  const tx = await nativeNftSaleProxyContract.updatePrice(convertedPrice);
  return tx;
};

export const transferNativeNftSaleOwnership = async (account: string, newOwner: string) => {
  const nftContract = getNativeNftSaleProxyContract(account);
  const tx = await nftContract.transferOwnership(newOwner);
  return tx;
};

export const updateBaseUri = async (account: string, newUri: string) => {
  const nftContract = getNftContract(account);
  const tx = await nftContract.setBaseURI(newUri);
  return tx;
};

export const updateMaxSupply = async (account: string, newSupply: string) => {
  const nftContract = getNftContract(account);
  const supply = BigNumber.from(newSupply).mul(DECIMALS);
  const tx = await nftContract.updateMaxSupply(supply);
  return tx;
};

export const addMinter = async (account: string, newMinter: string) => {
  const nftContract = getNftContract(account);
  const tx = await nftContract.setMinter(newMinter);
  return tx;
};

export const transferOwnership = async (account: string, newOwner: string) => {
  const nftContract = getNftContract(account);
  const tx = await nftContract.transferOwnership(newOwner);
  return tx;
};

export const transferErc20NftSaleOwnership = async (account: string, newOwner: string) => {
  const nftContract = getNftSaleProxyContract(account);
  const tx = await nftContract.transferOwnership(newOwner);
  return tx;
};

export const updateErc20NftPrice = async (account: string, newPrice: string) => {
  const nftContract = getNftSaleProxyContract(account);
  const convertedPrice = BigNumber.from(newPrice).mul(DECIMALS);
  const tx = await nftContract.updatePrice(convertedPrice);
  return tx;
};

export const withdrawErc20NftSaleFunds = async (account: string, recipientAddress: string) => {
  const nftContract = getNftSaleProxyContract(account);
  const tx = await nftContract.withdraw(recipientAddress, { gasLimit: 55000 });
  return tx;
};
