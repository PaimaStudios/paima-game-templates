import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import * as Paima from '@game/middleware';
import { Transak, TransakConfig } from '@transak/transak-sdk';
import { getSupplyCalldata } from './purchase';

interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
  futuristicName: string;
}
interface FetchedItem {
  amount: number;
  item_id: string;
  item: Item;
}

const items: Item[] = [
  { id: 1, name: 'Item 1', price: 0.013, image: 'weapon1.png', futuristicName: 'Quantum Blaster' },
  { id: 2, name: 'Item 2', price: 0.014, image: 'weapon2.png', futuristicName: 'Plasma Disruptor' },
  { id: 3, name: 'Item 3', price: 0.015, image: 'weapon3.png', futuristicName: 'Neutrino Cannon' },
  { id: 4, name: 'Item 4', price: 0.016, image: 'weapon4.png', futuristicName: 'Photon Saber' },
  { id: 5, name: 'Item 5', price: 0.017, image: 'weapon5.png', futuristicName: 'Graviton Pulse Rifle' },
  { id: 6, name: 'Item 6', price: 0.013, image: 'weapon6.png', futuristicName: 'Nano-Blade Launcher' },
  { id: 7, name: 'Item 7', price: 0.014, image: 'weapon7.png', futuristicName: 'Tachyon Beam Emitter' },
  { id: 8, name: 'Item 8', price: 0.020, image: 'weapon8.png', futuristicName: 'Antimatter Grenade' },
  { id: 9, name: 'Item 9', price: 0.021, image: 'weapon9.png', futuristicName: 'Fusion Core Detonator' },
  { id: 10, name: 'Item 10', price: 0.013, image: 'weapon10.png', futuristicName: 'Hyperion Railgun' },
  { id: 11, name: 'Item 11', price: 0.014, image: 'weapon11.png', futuristicName: 'Vortex Manipulator' },
  { id: 12, name: 'Item 12', price: 0.015, image: 'weapon12.png', futuristicName: 'Chrono-Displacer' },
  { id: 13, name: 'Item 13', price: 0.016, image: 'weapon13.png', futuristicName: 'Singularity Projector' },
  { id: 14, name: 'Item 14', price: 0.017, image: 'weapon14.png', futuristicName: 'Plasma Storm Generator' },
  { id: 15, name: 'Item 15', price: 0.013, image: 'weapon15.png', futuristicName: 'Nebula Shredder' },
  { id: 16, name: 'Item 16', price: 0.014, image: 'weapon16.png', futuristicName: 'Dark Matter Disintegrator' },
  { id: 17, name: 'Item 17', price: 0.020, image: 'weapon17.png', futuristicName: 'Quantum Entanglement Sniper' },
  { id: 18, name: 'Item 18', price: 0.021, image: 'weapon18.png', futuristicName: 'Supernova Catalyst' },
];

function App() {
  const [cart, setCart] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [walletConnected, setWalletConnected] = useState<string>('');
  const [shortWalletConnected, setShortWalletConnected] = useState<string>('');
  const [fetchedItems, setFetchedItems] = useState<FetchedItem[]>([]);
  const [orderSuccessData, setOrderSuccessData] = useState<any>(null);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  const startTransak = (item: Item) => {
    const amount = 1;
    const transakConfig: TransakConfig = {
      apiKey: '7724fced-2e9b-4302-b71d-9dc3cd697db4',
      environment: Transak.ENVIRONMENTS.STAGING,
      isTransakOne: true,
      smartContractAddress: '0x03A1146Cd04a9Ca5330de496b66a2c9EE07DfBC7',
      estimatedGasLimit: (item.price * 2382535 | 0),
      calldata: getSupplyCalldata(walletConnected, item.id, amount),
      network: 'arbitrum',
      disableWalletAddressForm: true,
      walletAddress: walletConnected,
      cryptoCurrencyData: [],
      // 4765.07 | 0.002 -> 2.382.535 ETH/CLP
      // 27733 -> 0.01164012281  
      sourceTokenData: [{ sourceTokenCode: 'ETH', sourceTokenAmount: item.price }],
      partnerOrderId: 'id-' + item.futuristicName.toLocaleLowerCase().replace(/\w+/g, '-'),
      partnerCustomerId: '789023',
    };
    
    const transak = new Transak(transakConfig);
    
    transak.init();
    
    // To get all the events
    Transak.on('*', (data) => {
      console.log(data);
    });
    
    // This will trigger when the user closed the widget
    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      console.log('Transak SDK closed!');
    });
    
    /*
    * This will trigger when the user has confirmed the order
    * This doesn't guarantee that payment has completed in all scenarios
    * If you want to close/navigate away, use the TRANSAK_ORDER_SUCCESSFUL event
    */
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
      console.log(orderData);
    });
    
    /*
    * This will trigger when the user marks payment is made
    * You can close/navigate away at this event
    */
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData);
      setOrderSuccessData(orderData);
      closeModal();
      transak.close();
      startUpdateCycle();
    });
  };

  const openModal = (item: Item) => {
    setSelectedItem(item);
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    setSelectedItem(null);
    document.body.classList.remove('modal-open');
  };

  const connectWallet = async () => {
    try {
      const result = await Paima.Paima.endpoints.userWalletLogin({
        mode: 0 as any
      });
      if (result.success) {
        setWalletConnected(result.result.walletAddress);
        setShortWalletConnected(result.result.walletAddress.slice(0, 6) + '...' + result.result.walletAddress.slice(-4));
        console.log('Wallet connected:', shortWalletConnected);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWalletConnected('');
    }
  };

  const fetchItems = useCallback(async () => {
    if (walletConnected) {
      try {
        const response = await fetch(`http://localhost:3333/items?wallet=${walletConnected}`);
        if (response.ok) {
          const data = await response.json();
          data.stats.forEach((item: FetchedItem) => {
            item.item = items.find(i => i.id === parseInt(item.item_id))!;
          });
          setFetchedItems(data.stats);
          console.log('Fetched items:', data);
        } else {
          console.error('Failed to fetch items');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    }
  }, [walletConnected]);

  const startUpdateCycle = useCallback(() => {
    setShouldUpdate(true);
    setTimeout(() => {
      setShouldUpdate(false);
    }, 10 * 60 * 1000); // 10 minutes
  }, []);

  useEffect(() => {
    if (walletConnected && !shouldUpdate) {
      fetchItems();
      return;
    }

    let intervalId: NodeJS.Timeout;
    if (shouldUpdate) {
      fetchItems();
      intervalId = setInterval(fetchItems, 20000); // 20 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [shouldUpdate, walletConnected, fetchItems]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <div className="App">
      <h1>Futuristic Weapon Shop</h1>
      <button className="material-button" onClick={connectWallet}>
        {walletConnected ? 'Wallet Connected: ' + shortWalletConnected : 'Connect Wallet'}
      </button>
      
      {walletConnected && fetchedItems.length > 0 && (
        <div className="fetched-items">
          <h2>Your Items</h2>
          <ul>
            {fetchedItems.map((item) => (
              <li key={item.item_id} className="fetched-item">
                <img src={`/images/${item.item.image}`} alt={item.item.futuristicName} className="fetched-item-image" />
                <div className="fetched-item-details">
                  <span className="fetched-item-name">{item.item.futuristicName}</span>
                  <span className="fetched-item-amount">Amount: {item.amount}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="item-list">
        {items.map((item) => (
          <div key={item.id} className="item" onClick={() => openModal(item)}>
            <img src={`/images/${item.image}`} alt={item.name} />
            <h3>{item.futuristicName}</h3>
            <p>(ID {item.name})</p>
            <p>{item.price} ETH</p>
          </div>
        ))}
      </div>
      {selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedItem.futuristicName}</h2>
            <p>{selectedItem.name}</p>
            <p>Price: {selectedItem.price} ETH</p>
            {/* <iframe 
              id="transakIframe"
              src="https://global-stg.transak.com/
?apiKey=7724fced-2e9b-4302-b71d-9dc3cd697db4
&isTransakOne=true
&smartContractAddress=0x03A1146Cd04a9Ca5330de496b66a2c9EE07DfBC7
&estimatedGasLimit=237608
&calldata=eJylzdEJxDAMA9BdOoEjy%2FZlnDhOZuj47Q0QOLj3J4TQJbe3yCEacoC%2FUZQUF4NQnWMb1%2FSILAFqEFaip%2F0vEO1cfmwtj6ZYk%2BiRby6rlpxuBEt914j65%2F%2FregCZFTk1%0A
&cryptoCurrencyData=W3siY3J5cHRvQ3VycmVuY3lDb2RlIjoiQVdCVEMiLCJjcnlwdG9DdXJyZW5jeU5hbWUiOiJBYXZlIFBvbHlnb24gV0JUQyIsImNyeXB0b0N1cnJlbmN5SW1hZ2VVUkwiOiJodHRwczovL2Fzc2V0cy5jb2luZ2Vja28uY29tL2NvaW5zL2ltYWdlcy8xMTczNC9zdGFuZGFyZC9hV0JUQy5wbmcifV0%3D%0A
&network=ethereum
&sourceTokenData=W3sic291cmNlVG9rZW5Db2RlIjoiV0JUQyIsInNvdXJjZVRva2VuQW1vdW50IjowLjAwMDF9XQ%3D%3D%0A
&walletAddress=0xAc1b1aFBF71D66BE92415D84888d1601728Ba2F1"
              width="500"
              height="400"
              title="Transak Widget"
            ></iframe> */}
            <div style={{ marginTop: '20px' }}>
              <button className="material-button" onClick={() => startTransak(selectedItem)}>BUY NOW (credit card)</button>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button className="material-button" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div className="cart">
        <h2>Cart</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>{item.futuristicName} - ${item.price}</li>
          ))}
        </ul>
        <p>Total: ${cart.reduce((sum, item) => sum + item.price, 0)}</p>
      </div>

      {orderSuccessData && (
        <div className="modal-overlay" onClick={() => setOrderSuccessData(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Order Successful</h2>
            <h3>It might take a few minutes to process the transaction.</h3>
            <pre className="order-data">{JSON.stringify(orderSuccessData, null, 2)}</pre>
            <div style={{ marginTop: '20px' }}>
              <button className="material-button" onClick={() => setOrderSuccessData(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
