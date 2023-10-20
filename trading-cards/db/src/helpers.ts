import { getOwnedNfts } from '@paima/sdk/utils-backend';

export async function getOwnedNft(
  ...args: Parameters<typeof getOwnedNfts>
): Promise<undefined | number> {
  const nfts = await getOwnedNfts(...args);
  nfts.sort();
  return nfts[0] == null ? undefined : Number(nfts[0]);
}
