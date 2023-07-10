import { ExternalLinkIcon } from '@heroicons/react/outline';

import NFTImage from './NFTImage';

interface Props {
  image: string;
  nftPrice: string;
  explorerURL: string;
}

const PurchasePending = ({ image, nftPrice, explorerURL }: Props) => {
  return (
    <>
      <NFTImage image={image} />
      <div className="flex items-center justify-between">
        <h3 className="text-center font-bold text-black font-base">{nftPrice} milkTADA</h3>
        <p>Pending...</p>
      </div>
      <div className="flex flex-col items-center">
        <a className="cursor-pointer flex items-center" href={explorerURL} target="_blank">
          <p className="font-base text-14 mr-4 underline">Go to Explorer</p>
          <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </>
  );
};

export default PurchasePending;
