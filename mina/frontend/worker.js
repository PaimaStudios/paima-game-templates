import endpoints from './build/middleware.js';

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
await endpoints.prove(signature);
postMessage({ status: 'All done' });
