import os from 'os';
import logger from '../logger';
import graphite from 'graphite';
import config from '../config';

const { watcher } = config;

let addWatcher;

if (watcher) {
  const { host, port, category, prefix } = watcher;
  const url = `plaintext://${host}:${port}/`;
  const client = graphite.createClient(url);
  const hostname = os.hostname().replace('.qunar.com', '').replace(/\./g, '_');

  addWatcher = (key, count) => {
    const metry = `${category}${prefix}.${key}_Count_${hostname}`;
    const metrics = { [metry]: count };

    client.write(metrics, err => {
      if (!err) {
        client.end();
      } else {
        const e = err;
        e.name = 'watcher error';
        logger.error(e);
      }
    });
  };
}

export default addWatcher || (() => {});
