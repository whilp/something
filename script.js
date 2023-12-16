import sqlite3InitModule from './sqlite-wasm/index.mjs';

(async () => {
  const worker = new Worker('worker.js', {
    type: 'module',
  });

  worker.addEventListener('message', ({ data }) => {
    switch (data.type) {
      case 'log':
        console.log(data.payload.cssClass, ...data.payload.args);
        break;
      default:
        console.log('error', 'Unhandled message:', data.type);
    }
  });
})();
