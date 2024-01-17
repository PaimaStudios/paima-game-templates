import { createPublicClient, createWalletClient, custom, http } from "viem";
import type { PublicClient, WalletClient } from "viem";
import {
  NATIVE_PROXY,
  CARD_TRADE_NFT,
  CARD_TRADE_NATIVE_PROXY,
  CARD_PACK_PRICE,
  GENERIC_PAYMENT_PROXY,
} from "./constants";
import { viemChain } from "./chain";
import { characterToNumberMap } from "./utils";
import { GENERIC_PAYMENT_MESSAGES } from "@cards/game-logic";
import { WalletMode, WalletModeMap } from "@paima/sdk/providers";
import nftAbi from "@abi/@paima/evm-contracts/contracts/Nft.sol/Nft";
import nativeNftSaleAbi from "@abi/@paima/evm-contracts/contracts/NativeNftSale.sol/NativeNftSale";
import genericPaymentAbi from "@abi/@paima/evm-contracts/contracts/GenericPayment.sol/GenericPayment";

function getClient(): PublicClient {
  return createPublicClient({
    chain: viemChain,
    transport: http(),
  });
}
function getWallet(account: string): WalletClient {
  return createWalletClient({
    account: account as `0x${string}`,
    chain: viemChain,
    transport: custom(
      WalletModeMap[WalletMode.EvmInjected].getOrThrowProvider().getConnection()
        .api,
    ),
  });
}

export async function fetchCurrentNftTokenId(
  nftContractAddress: string,
): Promise<bigint> {
  const result = await getClient().readContract({
    address: nftContractAddress as `0x${string}`,
    abi: nftAbi,
    functionName: "currentTokenId",
    args: [],
  });
  return result;
}

/**
 * Amount that was and/or can be minted.
 * Not to be confused with amount already minted, that is "totalSupply".
 * Not to be confused with amount remaining to be minted, there is no name for that.
 */
export async function fetchNftMaxSupply(
  nftContractAddress: string,
): Promise<bigint> {
  const result = await getClient().readContract({
    address: nftContractAddress as `0x${string}`,
    abi: nftAbi,
    functionName: "maxSupply",
    args: [],
  });
  return result;
}

export const buyAccountNft = async (account: string): Promise<string> => {
  const accountNftPrice = await getClient().readContract({
    address: NATIVE_PROXY as `0x${string}`,
    abi: nativeNftSaleAbi,
    functionName: "nftPrice",
  });
  const gasPrice = await getClient().getGasPrice();

  const characterNumber = characterToNumberMap["null"];

  const { request } = await getClient().simulateContract({
    account: account as `0x${string}`,
    address: NATIVE_PROXY as `0x${string}`,
    abi: nativeNftSaleAbi,
    functionName: "buyNft",
    gas: 800000n,
    gasPrice,
    value: accountNftPrice,
    args: [account as `0x${string}`, characterNumber],
  });
  const txHash = await getWallet(account).writeContract(request);
  return txHash;
};

export const buyCardPack = async (account: string) => {
  const gasPrice = await getClient().getGasPrice();
  const { request } = await getClient().simulateContract({
    account: account as `0x${string}`,
    address: GENERIC_PAYMENT_PROXY as `0x${string}`,
    abi: genericPaymentAbi,
    functionName: "pay",
    gas: 800000n,
    gasPrice,
    value: BigInt(CARD_PACK_PRICE.toString()),
    args: [GENERIC_PAYMENT_MESSAGES.buyCardPack],
  });
  const txHash = await getWallet(account).writeContract(request);

  return txHash;
};

export const buyTradeNft = async (account: string) => {
  const tradeNftPrice = await getClient().readContract({
    address: CARD_TRADE_NATIVE_PROXY as `0x${string}`,
    abi: nativeNftSaleAbi,
    functionName: "nftPrice",
  });
  const gasPrice = await getClient().getGasPrice();
  const characterNumber = characterToNumberMap["null"];

  const { request } = await getClient().simulateContract({
    account: account as `0x${string}`,
    address: CARD_TRADE_NATIVE_PROXY as `0x${string}`,
    abi: nativeNftSaleAbi,
    functionName: "buyNft",
    gas: 800000n,
    gasPrice,
    value: tradeNftPrice,
    args: [account as `0x${string}`, characterNumber],
  });
  const txHash = await getWallet(account).writeContract(request);

  return txHash;
};

export const burnTradeNft = async (account: string, nftId: bigint) => {
  const gasPrice = await getClient().getGasPrice();
  const { request } = await getClient().simulateContract({
    account: account as `0x${string}`,
    address: CARD_TRADE_NFT as `0x${string}`,
    abi: nftAbi,
    functionName: "burn",
    gas: 800000n,
    gasPrice,
    args: [nftId],
  });
  const txHash = await getWallet(account).writeContract(request);
  return txHash;
};
