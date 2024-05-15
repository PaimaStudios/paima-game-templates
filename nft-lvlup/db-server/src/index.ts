import { PGlite } from '@electric-sql/pglite';
import { resolve as resolvePath } from 'path';
import { readFileSync } from 'fs';

// @ts-expect-error no types
import { createServer } from 'pglite-server';

const path = resolvePath(process.cwd(), '..', 'db', 'migrations/init/init.sql');

const initSql = readFileSync(path, 'utf8');

const run = async () => {
  try {
    const db = new PGlite();
    await db.waitReady;

    await db.exec(`CREATE DATABASE postgres`);

    await db.exec(initSql);

    const PORT = 5432;
    const pgServer = createServer(db);

    pgServer.listen(PORT, () => {
      console.log(`Server bound to port ${PORT}`);
    });
  } catch (e) {
    console.log('in catch');
    console.error(e);
  }
};

run();
