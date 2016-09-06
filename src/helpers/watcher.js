import os from 'os';
import logger from '../logger';
import graphite from 'graphite';
import config from '../config';

const { watcher } = config;

const cycle = 59 * 1000; // 每分钟都感觉少了那么 1s
const metrics = {
  _data: {},

  addMetry(metry, count) {
    if (typeof this._data[metry] === 'number') {
      this._data[metry] += count;
    } else {
      this._data[metry] = count;
    }
  },

  clear() {
    Object.keys(this._data).forEach(metry => {
      this._data[metry] = null;
    });
  },

  sendToWatcher(url) {
    const client = graphite.createClient(url);
    client.write(this._data, err => {
      if (!err) {
        client.end();
        this.clear();
      } else {
        const e = err;
        e.name = 'watcher error';
        logger.error(e);
      }
    });
  },
};

let addWatcher;

if (watcher) {
  const { host, port, category, prefix } = watcher;
  const url = `plaintext://${host}:${port}/`;
  const hostname = os.hostname().replace('.qunar.com', '').replace(/\./g, '_');

  addWatcher = (key, count) => {
    const metry = `${category}${prefix}.${key}_Count_${hostname}`;
    metrics.addMetry(metry, count);
  };

  setTimeout(() => metrics.sendToWatcher(url), cycle);
}

export default addWatcher || (() => {});
