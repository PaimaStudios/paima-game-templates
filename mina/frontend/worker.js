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

try {
  postMessage({ start: 'compile', log: 'Compiling' });
  const vkLen = await endpoints.compile();
  postMessage({ end: 'compile', log: `Verification key JSON size is ${vkLen} B` });
  const signature = await signaturePromise;
  postMessage({ start: 'prove', log: 'Proving' });
  const proof = await endpoints.prove(signature);
  postMessage({ end: 'prove', log: `Proof JSON size is ${JSON.stringify(proof).length} B` })
  postMessage({ start: 'verify', log: 'Verifying locally' });
  const ok = await endpoints.verify(proof);
  postMessage({ end: 'verify', log: `Verify ${ok ? 'okay' : 'FAILED!'}` });

  postMessage({ log: 'All done' });
} catch (e) {
  postMessage({ log: e });
  throw e;
}
