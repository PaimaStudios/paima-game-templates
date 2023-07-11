import React from 'react';
import { Route, Routes } from 'react-router-dom';

import {
  addMinter,
  transferErc20NftSaleOwnership,
  transferNativeNftSaleOwnership,
  transferOwnership,
  updateBaseUri,
  updateErc20NftPrice,
  updateMaxSupply,
  updateNftPrice,
} from '../../services/contract';
import { AdminAction } from './AdminPage';
import UpdateErc20NftSaleContract from './UpdateErc20NftSaleContract';
import UpdateNativeNftSaleContract from './UpdateNativeNftSaleContract';
import UpdateNftContract from './UpdateNftContract';

const FormRouter: React.FC = () => {
  return (
    <Routes>
      <Route
        path={AdminAction.TransferNftContract}
        element={
          <UpdateNftContract
            contractFunction={transferOwnership}
            title="Transfer NFT contract ownership"
            label="New Owner"
          />
        }
      />
      <Route
        path={AdminAction.TransferNativeNftSaleContract}
        element={
          <UpdateNativeNftSaleContract
            contractFunction={transferNativeNftSaleOwnership}
            title="Transfer NativeNftSale contract ownership"
            label="New Owner"
          />
        }
      />
      <Route
        path={AdminAction.TransferErc20NftSaleContract}
        element={
          <UpdateErc20NftSaleContract
            contractFunction={transferErc20NftSaleOwnership}
            title="Transfer Erc20NftSale contract ownership"
            label="New Owner"
          />
        }
      />
      <Route
        path={AdminAction.AddMinter}
        element={
          <UpdateNftContract
            contractFunction={addMinter}
            title="Add a minter to the Nft contract"
            label="Minter address"
          />
        }
      />
      <Route
        path={AdminAction.UpdateMaxSupply}
        element={
          <UpdateNftContract
            contractFunction={updateMaxSupply}
            title="Update max supply of the Nft contract"
            label="Max supply"
            numberValue
          />
        }
      />
      <Route
        path={AdminAction.UpdateBaseUri}
        element={
          <UpdateNftContract
            contractFunction={updateBaseUri}
            title="Update base URI of the Nft contract"
            label="New URI"
          />
        }
      />
      <Route
        path={AdminAction.UpdateNftPriceNativeNftSale}
        element={
          <UpdateNativeNftSaleContract
            contractFunction={updateNftPrice}
            title="Update NFT price in the NativeNftSale contract"
            label="New price"
            numberValue
          />
        }
      />
      <Route
        path={AdminAction.UpdateNftPriceErc20NftSale}
        element={
          <UpdateErc20NftSaleContract
            contractFunction={updateErc20NftPrice}
            title="Update NFT price in the Erc20NftSale contract"
            label="New price"
            numberValue
          />
        }
      />
    </Routes>
  );
};

export default FormRouter;
