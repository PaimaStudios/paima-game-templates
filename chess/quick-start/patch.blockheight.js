const fs = require('fs');
const https = require('https');

// RPC command
const getBlockHeight = (url, command) =>
  new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(command).length,
      },
    };

    const req = https.request(url, options, response => {
      let result = '';
      response.on('data', chunk => (result += chunk));
      response.on('end', () => resolve(parseInt(JSON.parse(result).result.number, 16)));
    });
    req.on('error', err => reject(err));
    req.write(JSON.stringify(command));
    req.end();
  });

// Update .env START_BLOCKHEIGHT with latest value from RPC command: "eth_getBlockByNumber"
const updateEnvFile = async file => {
  const dataEnv = await fs.promises.readFile(__dirname + '/' + file, 'utf8');
  const url = dataEnv.match(/CHAIN_URI="(.+)"/)[1];
  if (!url) throw new Error('CHAIN_URI not found');
  const START_BLOCKHEIGHT = await getBlockHeight(url, {
    jsonrpc: '2.0',
    method: 'eth_getBlockByNumber',
    params: ['latest', false],
    id: 1,
  });
  const ndataEnv = dataEnv.replace(
    /START_BLOCKHEIGHT="\d+"/,
    `START_BLOCKHEIGHT="${START_BLOCKHEIGHT}"`
  );
  await fs.promises.writeFile(__dirname + '/' + file, ndataEnv, 'utf8');
  // console.log(`ENV file changed: START_BLOCKHEIGHT="${START_BLOCKHEIGHT}"`);
};

const start = async () => {
  await updateEnvFile('.env.docker');
};

start()
  .then()
  .catch(e => console.log('Error:', e));
