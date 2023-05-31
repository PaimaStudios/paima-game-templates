import { useWeb3Context } from '../hooks/useWeb3Context';

import ConnectWallet from '../components/ConnectWallet';
import BuyProgress from '../components/BuyProgress';
import { NFT_PRICE, NFT_SUPPLY } from '../services/constants';

const NFTSale = () => {
  const { connected } = useWeb3Context();

  if (!connected) {
    return <ConnectWallet />;
  }

  const nftImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
  return <BuyProgress image={nftImage} nftPrice={NFT_PRICE} nftSupply={NFT_SUPPLY} />;
};

export default NFTSale;
