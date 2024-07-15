import endpoints, { WalletMode } from '@game/middleware';
import { PaimaEvent, PaimaEventListener, PaimaEventSystemSTFGlobal } from '@paima/sdk/events';


type STFEvent = {block: number; emulated: number | undefined};
// Paima Stuff
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
    connectEvents: (callback: (block: number) => void) => {
        const listener = new PaimaEventListener(process.env);
        const event = new PaimaEventSystemSTFGlobal();
        event.callback = (event: PaimaEvent<STFEvent>, message: STFEvent) => { 
            console.log('socket', { event, message }) 
            callback(message.block);
        };
        listener.subscribe(event);
    },
    getCards: async (): Promise<{card: number, upwards: boolean}[]> => {
        const data = await endpoints.getGame();
        if (!data.success) throw new Error('Cannot fetch');
        return data.stats;
    }
};
