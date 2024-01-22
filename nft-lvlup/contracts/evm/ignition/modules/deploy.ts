import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import type {
  IgnitionModuleBuilder,
  NamedArtifactContractDeploymentFuture,
} from '@nomicfoundation/ignition-core';

function createNft(m: IgnitionModuleBuilder) {
  // This address is the owner of the ProxyAdmin contract,
  // so it will be the only account that can upgrade the proxy when needed.
  // https://github.com/NomicFoundation/hardhat-ignition/issues/673
  const proxyAdminOwner = m.getAccount(0);

  const name = m.getParameter('name');
  const ticker = m.getParameter('ticker');
  const nftContract = m.contract('AnnotatedMintNft', [
    name,
    ticker,
    1_000_000_000,
    proxyAdminOwner,
  ]);

  return { nftContract };
}
function createNftNativeSale(
  m: IgnitionModuleBuilder,
  nftContract: NamedArtifactContractDeploymentFuture<'AnnotatedMintNft'>
) {
  // https://github.com/NomicFoundation/hardhat-ignition/issues/673
  const proxyAdminOwner = m.getAccount(0);

  // https://github.com/NomicFoundation/hardhat-ignition/issues/672
  // const baseUri = m.getParameter('baseUri');
  // m.call(nftContract, 'setBaseUri', [baseUri]);

  const nftSaleContract = m.contract('TypedNativeNftSale', []);

  // https://github.com/NomicFoundation/hardhat-ignition/issues/672
  const price = m.getParameter('price');
  m.call(nftSaleContract, 'updatePrice', [price]);

  const nativeSaleProxyContract = m.contract('NativeNftSaleProxy', [
    nftSaleContract,
    proxyAdminOwner,
    nftContract,
    price,
  ]);

  // make that the NFT can be bought through the sale contract (and only the sale contract)
  m.call(nftContract, 'setMinter', [nativeSaleProxyContract], {
    id: 'AnnotatedMintNft_NativeNftSaleProxy_setMinter',
  });

  return { nativeSaleProxyContract };
}

function createNftErc20Sale(
  m: IgnitionModuleBuilder,
  nftContract: NamedArtifactContractDeploymentFuture<'AnnotatedMintNft'>
) {
  // https://github.com/NomicFoundation/hardhat-ignition/issues/673
  const proxyAdminOwner = m.getAccount(0);

  // https://github.com/NomicFoundation/hardhat-ignition/issues/672
  // const baseUri = m.getParameter('baseUri');
  // m.call(nftContract, 'setBaseUri', [baseUri]);

  const nftSaleContract = m.contract('TypedErc20NftSale', []);

  // https://github.com/NomicFoundation/hardhat-ignition/issues/672
  const price = m.getParameter('price');
  m.call(nftSaleContract, 'updatePrice', [price]);

  const erc20 = m.contract('ERC20PresetMinterPauser', [proxyAdminOwner]);
  m.call(erc20, 'mint', [proxyAdminOwner, 1_000_000_000_000_000]);
  const erc20SaleProxyContract = m.contract('Erc20NftSaleProxy', [
    nftSaleContract,
    [erc20],
    proxyAdminOwner,
    nftContract,
    price,
  ]);

  // make that the NFT can be bought through the sale contract (and only the sale contract)
  m.call(nftContract, 'setMinter', [erc20SaleProxyContract], {
    id: 'AnnotatedMintNft_Erc20NftSaleProxy_setMinter',
  });

  return { erc20, erc20SaleProxyContract };
}

const accountModule = buildModule('Character', m => {
  const { nftContract } = createNft(m);

  return {
    nftContract,
    ...createNftNativeSale(m, nftContract),
    ...createNftErc20Sale(m, nftContract),
  };
});

const L2Module = buildModule('L2Contract', m => {
  // https://github.com/NomicFoundation/hardhat-ignition/issues/673
  const l2Contract = m.contract('PaimaL2Contract', [m.getAccount(0), 1]);
  return { l2Contract };
});

export default buildModule('deploy', m => {
  // https://github.com/NomicFoundation/hardhat-ignition/issues/675
  return {
    ...m.useModule(L2Module),
    ...m.useModule(accountModule),
  };
});
