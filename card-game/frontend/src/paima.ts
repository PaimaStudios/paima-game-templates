import endpoints from '@game/middleware';
import { PaimaEventManager, BuiltinEvents } from '@paima/sdk/events';
import { WalletMode } from '@paima/sdk/providers';
import { events } from '@game/events';

export const paima = {
  start: async () => {
    const wallet = await endpoints.userWalletLogin({
      mode: WalletMode.EvmInjected,
      preferBatchedMode: false,
    });

    console.log({ wallet });
    if (!wallet.success) return null;
  },
  sendTX: async (card1to9: number) => {
    const data = await endpoints.click(card1to9);
    return data;
  },
  connectEvents: async (callback: (info: string) => void) => {
    // const QuestCompletionEvent = genEvent({
    //   name: 'QuestCompletion',
    //   fields: [
    //     {
    //       name: 'questId',
    //       type: Type.Integer(),
    //       indexed: true,
    //     },
    //     {
    //       name: 'playerId',
    //       type: Type.Integer(),
    //     },
    //   ],
    // } as const);

    // await PaimaEventManager.Instance.sendMessage(
    //   BuiltinEvents.RollupBlock,
    //   { block: 'asdf' as any, } as any
    // );
    await PaimaEventManager.Instance.subscribe(
      {
        topic: BuiltinEvents.RollupBlock,
        // topic: {
        //   ...QuestCompletionEvent,
        //   path: ['questId'],
        //   broker: PaimaEventBrokerNames.PaimaEngine,
        //   type: Type.Object({ questId: Type.Integer(), playerId: Type.Integer() }),
        // },
        filter: { block: undefined }, // all quests
      },
      event => {
        console.log(`EVENT: ${event.block} || ${event.emulated}`);
        callback(`Rollup block: ${event.block}`);
      }
    );
    await PaimaEventManager.Instance.subscribe(
      {
        topic: events.ClickEvent,
        filter: { user: undefined }, // all users
      },
      event => {
        console.log(`EVENT: ${event.time}`);
        callback(`Click time: ${event.time}`);
      }
    );
  },
  getCards: async (): Promise<{ card: number; upwards: boolean }[]> => {
    const data = await endpoints.getGame();
    if (!data.success) throw new Error('Cannot fetch');
    return data.result;
  },
};
