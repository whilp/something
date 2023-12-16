import { sqlite3Worker1Promiser } from './sqlite-wasm/index.mjs'

class DB {
    constructor() {
        self.promiser = await new Promise((resolve) => {
            const _promiser = sqlite3Worker1Promiser({
                onready: () => {
                    resolve(_promiser);
                },
            });
        });
    }
}

(async () => {
    try {
        console.log('Loading and initializing SQLite3 module...');

        const promiser = await new Promise((resolve) => {
            const _promiser = sqlite3Worker1Promiser({
                onready: () => {
                    resolve(_promiser);
                },
            });
        });

        let got;

        got = await promiser('open', {
            filename: 'file:mydb.sqlite3?vfs=opfs',
        });

        const { dbId } = got;

        await promiser('exec', { dbId, sql: 'CREATE TABLE IF NOT EXISTS t(a,b)' });
    
        for (let i = 20; i <= 25; ++i) {
          await promiser('exec', {
            dbId,
            sql: 'INSERT INTO t(a,b) VALUES (?,?)',
            bind: [i, i * 2],
          });
        }
    
        await promiser('exec', {
          dbId,
          sql: 'SELECT a FROM t ORDER BY a LIMIT 3',
          callback: (result) => {
            if (!result.row) {
              return;
            }
            console.log(result)
          },
        });
    } catch (err) {
        if (!(err instanceof Error)) {
            err = new Error(err.result.message);
        }
        console.error(err.name, err.message);
    }
})();