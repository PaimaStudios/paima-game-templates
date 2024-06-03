import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import type { IgnitionModuleBuilder } from '@nomicfoundation/ignition-core';

export default buildModule('L2Contract', m => {
  // https://github.com/NomicFoundation/hardhat-ignition/issues/673
  const l2Contract = m.contract('PaimaL2Contract', [m.getAccount(0), 1]);
  const canvasGame = m.contract('CanvasGame', [m.getAccount(0)], { after: [l2Contract] });
  return { l2Contract, canvasGame };
});
