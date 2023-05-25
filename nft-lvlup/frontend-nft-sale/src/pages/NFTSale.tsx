import { useWeb3Context } from '../hooks/useWeb3Context';

import ConnectWallet from '../components/ConnectWallet';
import BuyProgress from '../components/BuyProgress';
import { NFT_PRICE, NFT_SUPPLY } from '../services/constants';

const NFTSale = () => {
  const { connected } = useWeb3Context();

  if (!connected) {
    return <ConnectWallet />;
  }

  return (
    <BuyProgress
      imageModal="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
      nftPrice={NFT_PRICE}
      nftSupply={NFT_SUPPLY}
      // TODO: change tokenId to a real value
      tokenId="tokenId"
    />
  );
};

export default NFTSale;
