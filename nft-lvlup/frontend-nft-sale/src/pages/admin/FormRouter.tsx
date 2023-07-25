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
  withdrawErc20NftSaleFunds,
  withdrawNativeNftSaleFunds,
} from '../../services/contract';
import { AdminAction } from './AdminPage';
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
          <UpdateNftContract
            contractFunction={transferNativeNftSaleOwnership}
            title="Transfer NativeNftSale contract ownership"
            label="New Owner"
          />
        }
      />
      <Route
        path={AdminAction.TransferErc20NftSaleContract}
        element={
          <UpdateNftContract
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
          <UpdateNftContract
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
          <UpdateNftContract
            contractFunction={updateErc20NftPrice}
            title="Update NFT price in the Erc20NftSale contract"
            label="New price"
            numberValue
          />
        }
      />
      <Route
        path={AdminAction.WithdrawNativeNftSaleContractFunds}
        element={
          <UpdateNftContract
            contractFunction={withdrawNativeNftSaleFunds}
            title="Withdraw funds from the NativeNftSale contract"
            label="Transfer to address"
          />
        }
      />
      <Route
        path={AdminAction.WithdrawErc20NftSaleContractFunds}
        element={
          <UpdateNftContract
            contractFunction={withdrawErc20NftSaleFunds}
            title="Withdraw funds from the Erc20NftSale contract"
            label="Transfer to address"
          />
        }
      />
    </Routes>
  );
};

export default FormRouter;
