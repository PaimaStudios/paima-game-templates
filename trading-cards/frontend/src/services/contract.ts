import type { Signer } from "@ethersproject/abstract-signer";
import { BigNumber as EthersBigNumber, providers } from "ethers";

import {
  NATIVE_PROXY,
  CHAIN_URI,
  CARD_TRADE_NFT,
  CARD_TRADE_NATIVE_PROXY,
  CARD_PACK_PRICE,
  GENERIC_PAYMENT_PROXY,
} from "./constants";
import { characterToNumberMap } from "./utils";
import {
  GenericPayment__factory,
  NativeNftSale__factory,
  Nft__factory,
} from "@src/typechain";
import { BigNumber } from "bignumber.js";
import { GENERIC_PAYMENT_MESSAGES } from "@cards/game-logic";

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

export async function fetchNftPrice(): Promise<BigNumber> {
  const contract = NativeNftSale__factory.connect(
    NATIVE_PROXY,
    getSignerOrProvider(),
  );
  const result: EthersBigNumber = await contract.nftPrice();
  return new BigNumber(result.toString());
}

export async function fetchCurrentNftTokenId(
  nftContractAddress: string,
): Promise<number> {
  const contract = Nft__factory.connect(
    nftContractAddress,
    getSignerOrProvider(),
  );
  const result: EthersBigNumber = await contract.currentTokenId();
  return result.toNumber();
}

/**
 * Amount that was and/or can be minted.
 * Not to be confused with amount already minted, that is "totalSupply".
 * Not to be confused with amount remaining to be minted, there is no name for that.
 */
export async function fetchNftMaxSupply(
  nftContractAddress: string,
): Promise<number> {
  const contract = Nft__factory.connect(
    nftContractAddress,
    getSignerOrProvider(),
  );
  const result: EthersBigNumber = await contract.maxSupply();
  return result.toNumber();
}

export const buyNft = async (account: string) => {
  const signer = getSignerOrProvider(account);
  const nativeNftSaleProxyContract = NativeNftSale__factory.connect(
    NATIVE_PROXY,
    signer,
  );
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

export const buyCardPack = async (account: string) => {
  const signer = getSignerOrProvider(account);
  const gasPrice = await signer.getGasPrice();
  const genericPaymentProxyContract = GenericPayment__factory.connect(
    GENERIC_PAYMENT_PROXY,
    signer,
  );
  const tx = await genericPaymentProxyContract.pay(
    GENERIC_PAYMENT_MESSAGES.buyCardPack,
    {
      gasPrice,
      gasLimit: 800000,
      value: EthersBigNumber.from(CARD_PACK_PRICE.toString()),
    },
  );

  return tx;
};

export const buyTradeNft = async (account: string) => {
  const signer = getSignerOrProvider(account);
  const nativeNftSaleProxyContract = NativeNftSale__factory.connect(
    CARD_TRADE_NATIVE_PROXY,
    signer,
  );
  const tokenPrice = await nativeNftSaleProxyContract.nftPrice();
  const gasPrice = await signer.getGasPrice();
  const characterNumber = characterToNumberMap["null"];
  const tx = await nativeNftSaleProxyContract.buyNft(account, characterNumber, {
    gasPrice,
    gasLimit: 800000,
    value: tokenPrice.toString(),
  });
  return tx;
};

export const burnTradeNft = async (account: string, nftId: number) => {
  const signer = getSignerOrProvider(account);
  const paimaNftContract = Nft__factory.connect(CARD_TRADE_NFT, signer);
  const gasPrice = await signer.getGasPrice();

  const tx = await paimaNftContract.burn(nftId, {
    gasPrice,
    gasLimit: 800000,
  });
  return tx;
};
