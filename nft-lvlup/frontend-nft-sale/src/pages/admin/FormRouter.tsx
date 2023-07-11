import React from 'react';
import { Route, Routes } from 'react-router-dom';

import {
  addMinter,
  transferNativeNftSaleOwnership,
  transferOwnership,
  updateBaseUri,
  updateMaxSupply,
  updateNftPrice,
} from '../../services/contract';
import Page404 from '../Page404';
import { AdminAction } from './AdminPage';
import NftContractTransfer from './NftContractTransfer';
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
            title="Transfer NFT contract"
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
      <Route path={AdminAction.TransferErc20NftSaleContract} element={<NftContractTransfer />} />
      <Route
        path={AdminAction.AddMinter}
        element={
          <UpdateNftContract
            contractFunction={addMinter}
            title="Add minter"
            label="Minter address"
          />
        }
      />
      <Route
        path={AdminAction.UpdateMaxSupply}
        element={
          <UpdateNftContract
            contractFunction={updateMaxSupply}
            title="Update max supply"
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
            title="Update base URI"
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
      <Route path={AdminAction.UpdateNftPriceErc20NftSale} element={<Page404 />} />
    </Routes>
  );
};

export default FormRouter;
