import type { Signer } from "@ethersproject/abstract-signer";
import { BigNumber as EthersBigNumber, providers } from "ethers";

import { NATIVE_PROXY, NFT, CHAIN_URI } from "./constants";
import { characterToNumberMap } from "./utils";
import { NativeNftSale__factory, Nft__factory } from "@src/typechain";
import BigNumber from "bignumber.js";

declare let window: any;

export type SignerProvider = Signer | providers.Provider;

export const DECIMALS = EthersBigNumber.from(10).pow(18);

export const getSignerOrProvider = (account?: string): SignerProvider => {
  let signerOrProvider;

  if (account) {
    const provider = new providers.Web3Provider(window.ethereum);
    signerOrProvider = provider.getSigner();
  } else {
    const provider = new providers.JsonRpcProvider(CHAIN_URI);
    signerOrProvider = provider;
  }

  return signerOrProvider;
};

/** Note: the signer arg is available, but you probably never want to use it for this one. */
export const NftContract = (signer: SignerProvider = getSignerOrProvider()) => {
  return Nft__factory.connect(NFT, signer);
};

export const NativeNftSaleProxyContract = (
  signer: SignerProvider = getSignerOrProvider()
) => {
  return NativeNftSale__factory.connect(NATIVE_PROXY, signer);
};

export async function fetchNftPrice(): Promise<BigNumber> {
  const contract = NativeNftSale__factory.connect(
    NATIVE_PROXY,
    getSignerOrProvider()
  );
  const result: EthersBigNumber = await contract.nftPrice();
  return new BigNumber(result.toString());
}

export async function fetchCurrentNftTokenId(): Promise<number> {
  const contract = NftContract();
  const result: EthersBigNumber = await contract.currentTokenId();
  return result.toNumber();
}

/**
 * Amount that was and/or can be minted.
 * Not to be confused with amount already minted, that is "totalSupply".
 * Not to be confused with amount remaining to be minted, there is no name for that.
 */
export async function fetchNftMaxSupply(): Promise<number> {
  const contract = NftContract();
  const result: EthersBigNumber = await contract.maxSupply();
  return result.toNumber();
}

export const buyNft = async (account: string) => {
  const signer = getSignerOrProvider(account);
  const nativeNftSaleProxyContract = NativeNftSaleProxyContract(signer);
  const tokenPrice = await nativeNftSaleProxyContract.nftPrice();

  const provider = getSignerOrProvider();
  const gasPrice = await provider.getGasPrice();

  const characterNumber = characterToNumberMap["null"];

  const tx = await nativeNftSaleProxyContract.buyNft(account, characterNumber, {
    gasPrice,
    gasLimit: 800000,
    value: tokenPrice.toString(),
  });
  return tx;
};
