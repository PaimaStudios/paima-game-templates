import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Page404 from './pages/Page404';
import NFTSale from './pages/NFTSale';
import AdminPage, { AdminAction } from './pages/admin/AdminPage';
import NftContractTransfer from './pages/admin/NftContractTransfer';

export enum Pages {
  NFTSale = '/nft-sale',
  Admin = '/admin',
}

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={Pages.NFTSale} element={<NFTSale />} />
        <Route path={Pages.Admin} element={<AdminPage />} />
        <Route path={AdminAction.TransferNftContract} element={<NftContractTransfer />} />
        <Route path={AdminAction.TransferNativeNftSaleContract} element={<NftContractTransfer />} />
        <Route path={AdminAction.TransferErc20NftSaleContract} element={<NftContractTransfer />} />
        <Route path={AdminAction.AddMinter} element={<NftContractTransfer />} />
        <Route path={AdminAction.UpdateMaxSupply} element={<NftContractTransfer />} />
        <Route path={AdminAction.UpdateBaseUri} element={<NftContractTransfer />} />
        <Route path={AdminAction.UpdateNftPriceNativeNftSale} element={<NftContractTransfer />} />
        <Route path={AdminAction.UpdateNftPriceErc20NftSale} element={<NftContractTransfer />} />
        {/* Main purpose, used as homepage */}
        <Route index path="/" element={<NFTSale />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
