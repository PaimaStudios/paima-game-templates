import type { Signer } from '@ethersproject/abstract-signer';
import { BigNumber, providers } from 'ethers';
import { NativeNftSale__factory } from '../typechain';
import { NATIVE_NFT_SALE_PROXY, CHAIN_URI, CHAIN_CURRENCY_DECIMALS } from './constants';
import type { Characters } from './utils';
import { characterToNumberMap } from './utils';

export type SignerProvider = Signer | providers.Provider;

export const getSignerOrProvider = (account?: string): SignerProvider => {
  if (account) {
    const provider = new providers.Web3Provider(window.ethereum);
    return provider.getSigner();
  }

  return new providers.JsonRpcProvider(CHAIN_URI);
};

export const buyNft = async (account: string, character: Characters) => {
  const signer = getSignerOrProvider(account);
  const nativeNftSaleProxyContract = NativeNftSale__factory.connect(NATIVE_NFT_SALE_PROXY, signer);
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

export const getNftPrice = async (account: string) => {
  const signer = getSignerOrProvider(account);
  const nativeNftSaleProxyContract = NativeNftSale__factory.connect(NATIVE_NFT_SALE_PROXY, signer);
  const tokenPrice = await nativeNftSaleProxyContract.nftPrice();
  const divisor = BigNumber.from(Math.pow(10, CHAIN_CURRENCY_DECIMALS).toString());

  return tokenPrice.div(divisor).toString();
};
