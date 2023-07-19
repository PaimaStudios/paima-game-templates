import { useWeb3Context } from '../hooks/useWeb3Context';

import { useEffect, useState } from 'react';
import { buyNft, getNftPrice } from '../services/contract';
import type { Characters } from '../services/utils';
import PurchasePending from '../components/PurchasePending';
import PurchaseSuccessful from '../components/PurchaseSuccessful';
import Purchase from '../components/Purchase';
import { CHAIN_EXPLORER_URI, NFT } from '../services/constants';
import PurchaseWrapper from '../components/PurchaseWrapper';

const NFTSale = () => {
  const image = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

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
      <PurchaseWrapper address={currentAccount}>
        <PurchasePending
          image={image}
          nftPrice={nftPrice}
          explorerURL={`${CHAIN_EXPLORER_URI}/tx/${txHash}`}
        />
      </PurchaseWrapper>
    );
  }

  if (buySuccessful) {
    return (
      <PurchaseWrapper address={currentAccount}>
        <PurchaseSuccessful />
      </PurchaseWrapper>
    );
  }

  return (
    <PurchaseWrapper address={NFT}>
      <Purchase imageModal={image} nftPrice={nftPrice} onNftBuy={handleNftBuy} />
    </PurchaseWrapper>
  );
};

export default NFTSale;
