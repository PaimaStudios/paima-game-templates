import type { FormEventHandler } from 'react';
import { useState } from 'react';
import './App.css';
import mw from 'mw';

function App() {
  const [name, setName] = useState('');
  const [experience, setExperience] = useState(0);
  const [wallet, setWallet] = useState('');
  const [renamePending, setRenamePending] = useState(false);

  const [newName, setNewName] = useState('');

  const fetchPlayer = async (userWallet: string) => {
    const response = await mw.getUserState(userWallet);
    if (!response.success) {
      console.error('Failed to get user data', response.errorMessage, response.errorCode);
    } else {
      setExperience(response.result.experience);
      setName(response.result.name);
    }
  };

  const characterRename: FormEventHandler = async e => {
    e.preventDefault();

    setRenamePending(true);
    const response = await mw.renamePlayer(newName);
    if (response.success) {
      setRenamePending(false);
      setName(newName);
    } else {
      console.log('Failed to rename player');
      fetchPlayer(wallet);
    }
  };

  const userWalletLogin = async () => {
    const response = await mw.userWalletLogin('metamask');
    if (!response.success) {
      console.log('Error while logging in address:', response.errorMessage, response.errorCode);
    } else {
      const { walletAddress } = response.result;
      console.log('Successfully logged in address:', walletAddress);
      setWallet(walletAddress);
      fetchPlayer(walletAddress);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>
          Web 2.5 Example{' '}
          {name && (
            <span>
              {name} ({experience}xp)
            </span>
          )}
        </h1>
      </header>
      <main>
        <p>
          This example demonstrates Paima Engine capabilities when used in cooperation with
          traditional centralized game servers.
        </p>
        <ul>
          <li>
            Admin functionality (experience gain) - can be modified and stored on chain only from
            the traditional game server. Look for a well formed request example in{' '}
            <code>post-batcher.mjs</code>.
          </li>
          <li>
            Standard functionality (character rename) - can be modified and stored on chain directly
            by the player
          </li>
        </ul>
        <div>
          {wallet ? <p>Wallet: {wallet}</p> : <p>Wallet: No wallet connected</p>}

          <div className="button-group">
            <button onClick={userWalletLogin}>User Wallet Login</button>
            {wallet && <button onClick={() => fetchPlayer(wallet)}>Refresh</button>}
          </div>
        </div>
        {wallet && (
          <form onSubmit={characterRename}>
            <div className="name-input">
              <label htmlFor="name">Change your name:</label>
              <input
                type="text"
                id="name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                disabled={renamePending}
              />
            </div>
            <button type="submit">Rename</button>
          </form>
        )}
        {name && (
          <>
            <p>
              Now that you've named your player, try giving him some experience through this
              command:
            </p>
            <code>{`npm run post -- ${wallet} ${Math.floor(Math.random() * 100)}`}</code>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
