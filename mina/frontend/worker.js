import endpoints from './build/middleware.js';

postMessage({ status: 'Compiling' });
await endpoints.compile();
postMessage({ status: 'All done' });
