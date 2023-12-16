import sqlite3InitModule from './sqlite-wasm/index.mjs';

const start = function (sqlite3) {
  console.log('Running SQLite3 version', sqlite3.version.libVersion);
  let db;
  if ('opfs' in sqlite3) {
    db = new sqlite3.oo1.OpfsDb('/mydb.sqlite3');
    console.log('OPFS is available, created persisted database at', db.filename);
  } else {
    db = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct');
    console.log('OPFS is not available, created transient database', db.filename);
  }
  try {
    console.log('Creating a table...');
    db.exec('CREATE TABLE IF NOT EXISTS t(a,b)');
    console.log('Insert some data using exec()...');
    for (let i = 20; i <= 25; ++i) {
      db.exec({
        sql: 'INSERT INTO t(a,b) VALUES (?,?)',
        bind: [i, i * 2],
      });
    }
    console.log('Query data with exec()...');
    db.exec({
      sql: 'SELECT a FROM t ORDER BY a LIMIT 3',
      callback: (row) => {
        console.log(row);
      },
    });
  } finally {
    db.close();
  }
};

console.log('Loading and initializing SQLite3 module...');
sqlite3InitModule({
  print: console.log,
  printErr: console.error,
}).then((sqlite3) => {
  console.log('Done initializing. Running demo...');
  try {
    start(sqlite3);
  } catch (err) {
    console.error(err.name, err.message);
  }
});