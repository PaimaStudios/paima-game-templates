import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('Deploy', m => {
  // TODO: use ENV variable or fallback to Hardhat default key if using the hardhat network
  const deploy = m.contract('PaimaL2Contract', ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 100]);
  return { deploy };
});
