import React, { useState } from 'react';
import { EXPLORER_URL } from '../services/constants';
import Purchase from './Purchase';
import PurchaseSuccessful from './PurchaseSuccessful';
import PurchasePending from './PurchasePending';
import { useWeb3Context } from '../hooks/useWeb3Context';
import { buyNft } from '../services/contract';
import type { Characters } from '../services/utils';

interface Props {
  image: string;
  nftPrice: string;
  nftSupply: string;
}

const BuyProgress = ({ image, nftPrice, nftSupply }: Props) => {
  const { connected, currentAccount } = useWeb3Context();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [buySuccessful, setBuySuccessful] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>('');

  const handleNftBuy = async (character: Characters) => {
    if (!connected) return;

    try {
      const tx = await buyNft(currentAccount, character);
      setIsPending(true);
      setTxHash(tx.hash);
      await tx.wait(3);
      setIsPending(false);
      setBuySuccessful(true);
    } catch {
      setIsPending(false);
    }
  };

  if (isPending) {
    return (
      <PurchasePending
        image={image}
        nftPrice={nftPrice}
        nftSupply={nftSupply}
        explorerURL={`${EXPLORER_URL}/${txHash}`}
      />
    );
  }

  if (buySuccessful) {
    return <PurchaseSuccessful />;
  }

  return (
    <Purchase
      imageModal={image}
      nftPrice={nftPrice}
      nftSupply={nftSupply}
      onNftBuy={handleNftBuy}
    />
  );
};

export default BuyProgress;
