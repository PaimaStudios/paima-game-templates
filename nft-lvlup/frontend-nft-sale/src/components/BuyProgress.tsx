import React, { useEffect, useState } from 'react';
import { CHAIN_EXPLORER_URI } from '../services/constants';
import Purchase from './Purchase';
import PurchaseSuccessful from './PurchaseSuccessful';
import PurchasePending from './PurchasePending';
import { useWeb3Context } from '../hooks/useWeb3Context';
import { buyNft, getNftPrice } from '../services/contract';
import type { Characters } from '../services/utils';

interface Props {
  image: string;
}

const BuyProgress = ({ image }: Props) => {
  const { connected, currentAccount } = useWeb3Context();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [buySuccessful, setBuySuccessful] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>('');
  const [nftPrice, setNftPrice] = useState('');

  useEffect(() => {
    const getPrice = async (account: string) => {
      const price = await getNftPrice(account);
      setNftPrice(price);
    };
    getPrice(currentAccount);
  }, [currentAccount]);

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
        explorerURL={`${CHAIN_EXPLORER_URI}/${txHash}`}
      />
    );
  }

  if (buySuccessful) {
    return <PurchaseSuccessful />;
  }

  return <Purchase imageModal={image} nftPrice={nftPrice} onNftBuy={handleNftBuy} />;
};

export default BuyProgress;
