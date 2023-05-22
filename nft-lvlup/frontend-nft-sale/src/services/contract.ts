import type { Signer } from '@ethersproject/abstract-signer';
import type { Contract } from 'ethers';
import { BigNumber, providers } from 'ethers';
import { NativeNftSale__factory } from '../typechain';
import { NATIVE_NFT_SALE_PROXY, RPC_URL } from './constants';

declare let window: any;

export type SignerProvider = Signer | providers.Provider;

export const DECIMALS = BigNumber.from(10).pow(18);

export const getSignerOrProvider = (account?: string): SignerProvider => {
  let signerOrProvider;

  if (account) {
    const provider = new providers.Web3Provider(window.ethereum);
    signerOrProvider = provider.getSigner();
  } else {
    const provider = new providers.JsonRpcProvider(RPC_URL);
    signerOrProvider = provider;
  }

  return signerOrProvider;
};

export const NativeNftSaleProxyContract = (
  signer: SignerProvider = getSignerOrProvider()
): Contract => {
  return NativeNftSale__factory.connect(NATIVE_NFT_SALE_PROXY, signer);
};

export const buyNft = async (account: string, character: string) => {
  const signer = getSignerOrProvider(account);
  const nativeNftSaleProxyContract = NativeNftSaleProxyContract(signer);
  const tokenPrice = await nativeNftSaleProxyContract.nftPrice();

  const provider = getSignerOrProvider();
  const gasPrice = await provider.getGasPrice();

  // TODO: addd Nft type (character)
  const tx = await nativeNftSaleProxyContract.buyNft(account, {
    gasPrice,
    gasLimit: 800000,
    value: tokenPrice.toString(),
    // character,
  });

  return tx;
};
