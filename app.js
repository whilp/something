const container = document.querySelector('.worker');

const logHtml = (cssClass, ...args) => {
  const div = document.createElement('div');
  if (cssClass) div.classList.add(cssClass);
  div.append(document.createTextNode(args.join(' ')));
  container.append(div);
};

(async () => {
  const worker = new Worker('worker.js', {
    type: 'module',
  });

  worker.addEventListener('message', ({ data }) => {
    switch (data.type) {
      case 'log':
        logHtml(data.payload.cssClass, ...data.payload.args);
        break;
      default:
        logHtml('error', 'Unhandled message:', data.type);
    }
  });
})();