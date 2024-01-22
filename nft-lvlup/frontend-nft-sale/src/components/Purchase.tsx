import { ExternalLinkIcon } from '@heroicons/react/outline';

import { CHAIN_ID } from '../services/constants';
import NFTImage from './NFTImage';
import Button from './Buttons';
import { useState } from 'react';
import type { CharacterType } from '@game/utils';
import { characters } from '@game/utils';
import { useAccount, useChainId } from 'wagmi';
import { useSwitchChain } from 'wagmi';

interface Props {
  imageModal: string;
  nftPrice: string;
  onNftBuy: (character: CharacterType) => void;
}

const Purchase = ({ imageModal, nftPrice, onNftBuy }: Props) => {
  const { isConnected } = useAccount();
  const [character, setCharacter] = useState<CharacterType>(characters[0]);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  return (
    <>
      <NFTImage image={imageModal} />
      <div className="flex">
        <h3 className="text-left font-bold text-black font-base flex-1">{nftPrice} milkTADA</h3>
        <select
          value={character}
          onChange={e => setCharacter(e.target.value as CharacterType)}
          className="flex-1"
        >
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
          <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
      {chainId !== CHAIN_ID ? (
        <Button onClick={() => switchChain({ chainId: CHAIN_ID })} disabled={!isConnected}>
          Switch network
        </Button>
      ) : (
        <Button onClick={() => onNftBuy(character)} disabled={!isConnected}>
          Buy NFT
        </Button>
      )}
    </>
  );
};

export default Purchase;
