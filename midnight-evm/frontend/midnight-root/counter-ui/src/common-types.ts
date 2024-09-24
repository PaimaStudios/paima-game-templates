import { type Contract, type CounterPrivateState } from '@midnight-ntwrk/counter-contract';
import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { type DeployedContract, type StateWithZswap } from '@midnight-ntwrk/midnight-js-contracts';
import { type ZSwapWitnesses } from '@midnight-ntwrk/midnight-js-contracts/dist/zswap-witnesses';

export interface PrivateStates {
  counterPrivateState: CounterPrivateState;
}

export type CounterProviders = MidnightProviders<'increment', PrivateStates>;
export type CounterCircuitKeys = Exclude<keyof CounterContract['impureCircuits'], number | symbol>;

export type CounterContract = Contract<
  StateWithZswap<CounterPrivateState>,
  ZSwapWitnesses<StateWithZswap<CounterPrivateState>>
>;

export type DeployedCounterContract = DeployedContract<PrivateStates, 'counterPrivateState', CounterContract>;
