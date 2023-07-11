import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Page404 from './pages/Page404';
import NFTSale from './pages/NFTSale';
import AdminPage from './pages/admin/AdminPage';
import FormRouterPage from './pages/admin/FormRouter';

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
        <Route path={`${Pages.Admin}/*`} element={<FormRouterPage />} />
        {/* Main purpose, used as homepage */}
        <Route index path="/" element={<NFTSale />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
