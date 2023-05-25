import React, { useState } from 'react';
import { EXPLORER_URL } from '../services/constants';
import Purchase from './Purchase';
import PurchaseSuccessful from './PurchaseSuccessful';
import PurchasePending from './PurchasePending';

interface BuyProgressProps {
  titleModal?: string;
  nftName?: string;
  imageModal: string;
  nftPrice: string;
  nftSupply: string;
  tokenId: string;
}

const BuyProgress = ({ imageModal, nftPrice, nftSupply, tokenId }: BuyProgressProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [buySuccessful, setBuySuccessful] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>('');

  const txIsPending = (hash: string) => {
    setTxHash(hash);
    setIsPending(true);
  };

  const done = () => {
    setIsPending(false);
    setBuySuccessful(true);
  };

  const cancel = () => {
    setIsPending(false);
  };

  if (isPending) {
    return (
      <PurchasePending
        imageModal={imageModal}
        nftPrice={nftPrice}
        nftSupply={nftSupply}
        tokenId={tokenId}
        explorerURL={`${EXPLORER_URL}/${txHash}`}
      />
    );
  }

  if (buySuccessful) {
    return <PurchaseSuccessful />;
  }

  return (
    <Purchase
      imageModal={imageModal}
      nftPrice={nftPrice}
      nftSupply={nftSupply}
      tokenId={tokenId}
      txIsPending={txIsPending}
      done={done}
      cancel={cancel}
    />
  );
};

export default BuyProgress;
