import { ExternalLinkIcon } from '@heroicons/react/outline';

import { useWeb3Context } from '../hooks/useWeb3Context';
import { buyNft } from '../services/contract';
import { NFT } from '../services/constants';
import NFTImage from './NFTImage';
import Button from './Buttons';
import AddressInfo from './AddressInfo';

interface Props {
  imageModal: string;
  nftPrice: number;
  tokenId: string;
  nftTotal: number;
  txIsPending: (arg0: string) => void;
  done: () => void;
  cancel: () => void;
}

const Purchase = ({
  imageModal,
  nftPrice,
  tokenId,
  nftTotal,
  txIsPending,
  done,
  cancel,
}: Props) => {
  const { connected, currentAccount, network } = useWeb3Context();

  const buy = async () => {
    if (!connected) return;

    try {
      const tx = await buyNft(currentAccount);
      txIsPending(tx.hash);

      await tx.wait(3);
      done();
    } catch {
      cancel();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <AddressInfo network={network} address={NFT} />
      <NFTImage imageModal={imageModal} />
      <div className="flex items-center justify-between">
        <h3 className="text-center font-bold text-black font-base">{nftPrice} milkADA</h3>
        <p className="text-center text-14">
          #{tokenId} / {nftTotal}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <a
          className="cursor-pointer flex items-center"
          href="https://dcspark.github.io/milkomeda-documentation/cardano/for-end-users/"
          target="_blank"
        >
          <p className="font-base text-14 mr-4 underline">How to get milkADA</p>
          <ExternalLinkIcon className="h-4 w-4 " aria-hidden="true" />
        </a>
      </div>
      <Button onClick={buy} disabled={!connected}>
        Buy NFT
      </Button>
    </div>
  );
};

export default Purchase;
