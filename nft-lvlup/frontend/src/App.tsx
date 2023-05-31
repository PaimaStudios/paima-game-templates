import { useState } from 'react';
import './App.css';
import mw from 'mw';
import type { IGetUserCharactersResult } from '@game/db';

function App() {
  const [characters, setCharacters] = useState<IGetUserCharactersResult[]>([]);
  const [wallet, setWallet] = useState('');

  const fetchCharacters = async (userWallet: string) => {
    const response = await mw.getOwnedCharacters(userWallet);
    if (!response.success) {
      console.log('Failed to fetch your NFT characters');
    } else {
      setCharacters(response.result.characters);
    }
  };

  const characterLvlUp = async (character: IGetUserCharactersResult) => {
    const response = await mw.levelUp(character.address, character.nft_id);
    console.log({ response });
    if (response.success) {
      const newCharacters = characters.map(c =>
        c.nft_id === character.nft_id ? response.result.character : c
      );
      setCharacters(newCharacters);
    } else {
      console.log('Failed to level up character:', response.errorMessage, response.errorCode);
      fetchCharacters(wallet);
    }
  };

  async function userWalletLogin() {
    const response = await mw.userWalletLogin('metamask');
    if (!response.success) {
      console.log('Error while logging in address:', response.errorMessage, response.errorCode);
    } else {
      const { walletAddress } = response.result;
      console.log('Successfully logged in address:', walletAddress);
      setWallet(walletAddress);
      fetchCharacters(walletAddress);
    }
  }

  const hasCharacters = characters.length > 0;

  return (
    <div className="container">
      <header>
        <h1>Stateful NFT characters</h1>
      </header>
      <main>
        <div>
          {wallet ? <p>Wallet: {wallet}</p> : <p>Wallet: No wallet connected</p>}
          <div className="button-group">
            <button onClick={userWalletLogin}>User Wallet Login</button>
            <button onClick={() => fetchCharacters(wallet)}>Refresh</button>
          </div>
        </div>
        {wallet && (
          <>
            {hasCharacters ? (
              <div className="characters">
                {characters.map(character => (
                  <div key={character.nft_id} className={`character character-${character.type}`}>
                    <p>
                      {character.type} lvl. {character.level}
                    </p>
                    <button onClick={() => characterLvlUp(character)}>Lvl Up</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                You don't own any characters. Look into <code>frontend-nft-sale</code> directory to
                test buying some.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
