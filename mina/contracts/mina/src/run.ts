/**
 * This file specifies how to run the `SudokuZkApp` smart contract locally using the `Mina.LocalBlockchain()` method.
 * The `Mina.LocalBlockchain()` method specifies a ledger of accounts and contains logic for updating the ledger.
 *
 * Please note that this deployment is local and does not deploy to a live network.
 * If you wish to deploy to a live network, please use the zkapp-cli to deploy.
 *
 * To run locally:
 * Build the project: `$ npm run build`
 * Run with node:     `$ node build/src/run.js`.
 */
import { Sudoku, SudokuZkApp } from './sudoku.js';
import { cloneSudoku, generateSudoku, solveSudoku } from './sudoku-lib.js';
import { AccountUpdate, Lightnet, Mina, PrivateKey, PublicKey, fetchAccount } from 'o1js';

console.log('Compiling SudokuZkApp...');
await SudokuZkApp.compile();

/** Scaling factor from human-friendly MINA amount to raw integer fee amount. */
const MINA_TO_RAW_FEE = 1_000_000_000;

// ----------------------------------------------------------------------------
// Connect to Lightnet
const lightnetAccountManagerEndpoint = 'http://localhost:8181';
const lightnet = Mina.Network({
  mina: 'http://localhost:8080/graphql',
  lightnetAccountManager: lightnetAccountManagerEndpoint,
});
Mina.setActiveInstance(lightnet);

let lightnetAccount;
try {
  lightnetAccount = await Lightnet.acquireKeyPair({ lightnetAccountManagerEndpoint });
  const { publicKey: sender, privateKey: senderKey } = lightnetAccount;

  await Mina.waitForFunding(sender.toBase58());
  console.log('Sender balance:', lightnet.getAccount(sender).balance.toBigInt());

  // ----------------------------------------------------------------------------
  // Initialize our SudokuZkApp instance pointing to the preordained address.
  // In a real project,

  const zkAppPrivateKey = PrivateKey.fromBase58(
    'EKFDbNM9k1ZTzYQCoUmqUSrBLoLLGzLtYJADP4P8ivxZnjNqUGGB'
  );
  const zkAppAddress = PublicKey.fromBase58(
    'B62qpwRxuV4vYFT8QLnrmB67FaKQemy54QH2XuBTyErr9wDDpLHTmQy'
  );
  if (zkAppPrivateKey.toPublicKey().toBase58() !== zkAppAddress.toBase58()) {
    throw new Error('zkAppPrivateKey and zkAppAddress mismatched');
  }
  const zkApp = new SudokuZkApp(zkAppAddress);

  // --------------------------------------------------------------------------
  // Deploy a random Sudoku puzzle to said address
  const sudoku = generateSudoku(0.5);
  try {
    console.log('Deploying contract: preparing...');
    const tx = await Mina.transaction(
      {
        sender,
        fee: 0.01 * MINA_TO_RAW_FEE,
      },
      async () => {
        AccountUpdate.fundNewAccount(sender);
        await zkApp.deploy();
        await zkApp.update(Sudoku.from(sudoku));
      }
    );
    console.log('Deploying contract: proving...');
    await tx.prove();

    console.log('Deploying contract: signing and sending...');

    /**
     * note: this tx needs to be signed with `tx.sign()`, because `deploy` uses `requireSignature()` under the hood,
     * so one of the account updates in this tx has to be authorized with a signature (vs proof).
     * this is necessary for the deploy tx because the initial permissions for all account fields are "signature".
     * (but `deploy()` changes some of those permissions to "proof" and adds the verification key that enables proofs.
     * that's why we don't need `tx.sign()` for the later transactions.)
     */
    const pending = await tx.sign([zkAppPrivateKey, senderKey]).send();
    console.log('Deploying contract: waiting for confirmation...');
    console.log('Included:', await pending.wait());
  } catch (err) {
    console.error(err);
    console.log('Error deploying contract; trying the rest anyways...');
  }

  // --------------------------------------------------------------------------
  // Interact with the deployed contract

  await fetchAccount({ publicKey: zkApp.address });
  console.log('Is the sudoku solved?', zkApp.isSolved.get().toBoolean());

  let solution = solveSudoku(sudoku);
  if (solution === undefined) throw Error('cannot happen');

  // submit a wrong solution
  let noSolution = cloneSudoku(solution);
  noSolution[0][0] = (noSolution[0][0] % 9) + 1;

  console.log('Submitting wrong solution...');
  try {
    let tx = await Mina.transaction({
      sender,
      fee: 0.01 * MINA_TO_RAW_FEE,
    }, async () => {
      await zkApp.submitSolution(Sudoku.from(sudoku), Sudoku.from(noSolution));
    });
    await tx.prove();
    await tx.sign([senderKey]).send();
  } catch (err) {
    console.log('There was an error submitting the solution, as expected', err);
  }

  await fetchAccount({ publicKey: zkApp.address });
  console.log('Is the sudoku solved?', zkApp.isSolved.get().toBoolean());

  // submit the actual solution
  {
    console.log('Submitting solution: preparing...');
    const tx = await Mina.transaction({
      sender,
      fee: 0.01 * MINA_TO_RAW_FEE,
    }, async () => {
      await zkApp.submitSolution(Sudoku.from(sudoku), Sudoku.from(solution!));
    });
    console.log('Submitting solution: proving...');
    await tx.prove();
    console.log('Submitting solution: signing and sending...');
    const pending = await tx.sign([senderKey]).send();
    console.log('Submitting solution: waiting for confirmation...');
    console.log('Included:', await pending.wait());
  }

  await fetchAccount({ publicKey: zkApp.address });
  console.log('Is the sudoku solved?', zkApp.isSolved.get().toBoolean());

  // ----------------------------------------------------------------------------
  // Disconnect from Lightnet
} finally {
  if (lightnetAccount) {
    const releaseResult = await Lightnet.releaseKeyPair({
      publicKey: lightnetAccount.publicKey.toBase58(),
      lightnetAccountManagerEndpoint,
    });
    if (!releaseResult) {
      console.error('Failed to release lightnet keypair');
    }
  }
}