import React, { useState } from 'react';
import { EXPLORER_URL } from '../services/constants';
import Purchase from './Purchase';
import PurchaseSuccessful from './PurchaseSuccessful';
import PurchasePending from './PurchasePending';

interface BuyProgressProps {
  titleModal?: string;
  nftName?: string;
  imageModal: string;
  nftPrice: number;
  tokenId: string;
}

const BuyProgress = ({ imageModal, nftPrice, tokenId }: BuyProgressProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [buySuccessful, setBuySuccessful] = useState<boolean>(false);
  const [buyNftDetail, setBuyNftDetail] = useState<boolean>(true);
  const [txHash, setTxHash] = useState<string>('');

  const txIsPending = (hash: string) => {
    setTxHash(hash);
    setBuyNftDetail(false);
    setIsPending(true);
  };

  const done = () => {
    setIsPending(false);
    setBuySuccessful(true);
  };

  const cancel = () => {
    setIsPending(false);
  };

  if (buyNftDetail) {
    return (
      <Purchase
        imageModal={imageModal}
        nftPrice={nftPrice}
        tokenId={tokenId}
        txIsPending={txIsPending}
        done={done}
        cancel={cancel}
      />
    );
  }

  if (isPending) {
    return (
      <PurchasePending
        imageModal={imageModal}
        nftPrice={nftPrice}
        tokenId={tokenId}
        explorerURL={`${EXPLORER_URL}/${txHash}`}
      />
    );
  }

  if (!buySuccessful) {
    return <PurchaseSuccessful />;
  }
  return null;
};

export default BuyProgress;
