const fs = require('fs');
const file = 'db/docker/docker-compose.yml';

(async () => {
  const data = await fs.promises.readFile(file, 'utf8');
  const ndata = data.replace(/open-world-.+?-db/g, 'open-world-' + new Date().getTime() + '-db');
  await fs.promises.writeFile(file, ndata, 'utf8');
})();
