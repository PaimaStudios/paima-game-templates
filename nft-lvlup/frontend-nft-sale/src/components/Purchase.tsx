import { ExternalLinkIcon } from '@heroicons/react/outline';

import { useWeb3Context } from '../hooks/useWeb3Context';
import { buyNft } from '../services/contract';
import { NFT } from '../services/constants';
import NFTImage from './NFTImage';
import Button from './Buttons';
import AddressInfo from './AddressInfo';
import { useState } from 'react';

interface Props {
  imageModal: string;
  nftPrice: number;
  tokenId: string;
  txIsPending: (arg0: string) => void;
  done: () => void;
  cancel: () => void;
}

const characters = ['fire', 'water', 'earth', 'air', 'ether'];

const Purchase = ({ imageModal, nftPrice, tokenId, txIsPending, done, cancel }: Props) => {
  const [character, setCharacter] = useState(characters[0]);
  const { connected, currentAccount, network } = useWeb3Context();

  const buy = async () => {
    if (!connected) return;

    try {
      const tx = await buyNft(currentAccount, character);
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
      <NFTImage imageModal={imageModal} status={`#${tokenId}`} />
      <div className="flex">
        <h3 className="text-left font-bold text-black font-base flex-1">{nftPrice} milkTADA</h3>
        <select value={character} onChange={e => setCharacter(e.target.value)} className="flex-1">
          {characters.map(character => (
            <option value={character} key={character}>
              {character}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col items-center">
        <a
          className="cursor-pointer flex items-center"
          href="https://faucet-devnet-cardano-evm.c1.milkomeda.com/"
          target="_blank"
        >
          <p className="font-base text-14 mr-4 underline">How to get milkTADA</p>
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
