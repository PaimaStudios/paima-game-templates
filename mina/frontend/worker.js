import endpoints from './build/middleware/middleware.js';

function future() {
  let resolve;
  return [new Promise(r => resolve = r), resolve];
}

const [signaturePromise, signatureResolve] = future();

self.addEventListener('message', e => {
  if ('signature' in e.data) {
    signatureResolve(e.data.signature);
  }
});

postMessage({ status: 'Compiling' });
await endpoints.compile();
postMessage({ status: 'Waiting for your signature' });
const signature = await signaturePromise;
postMessage({ status: 'Proving' });
const proof = await endpoints.prove(signature);
postMessage({ status: `Proof JSON size is ${JSON.stringify(proof).length}` })
postMessage({ status: 'Verifying locally' });
const ok = await endpoints.verify(proof);
postMessage({ status: `Verify ${ok ? 'okay' : 'FAILED!'}` });
