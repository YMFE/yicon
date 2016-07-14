import { logTypes } from '../constants/utils';

export const versionTools = {
  v2n(version) {
    return version.split('.')
      .reduce((p, n, i) => p + n * Math.pow(1000, 2 - i), 0);
  },
  n2v(num) {
    return (num / 1000000000)
      .toFixed(9).match(/\d{3}/g).map(d => +d)
      .join('.');
  },
  update(version, type) {
    let v = version;
    if (typeof v === 'number') {
      v = versionTools.n2v(v);
    }
    const [major, minor, build] = v.split('.').map(n => +n);

    switch (type) {
      case 'major':
        return [major + 1, 0, 0].join('.');
      case 'minor':
        return [major, minor + 1, 0].join('.');
      case 'build':
        return [major, minor, build + 1].join('.');
      default:
        return null;
    }
  },
};

export const isPlainObject = obj => {
  try {
    return JSON.stringify(obj) === '{}';
  } catch (e) {
    return false;
  }
};

export class Logger {
  constructor(type, data = {}) {
    this.text = null;
    this.param = {};
    if (!~Object.keys(logTypes).indexOf(type)) {
      return;
    }
    this.text = logTypes[type];
    this.text = this.text.replace(/@(\w+)/g, (matched, key) => {
      const value = data[key];
      if (!value) throw new Error('日志缺少参数');
      this.param[key] = value;
      if (Array.isArray(value)) {
        return value.map(v => JSON.stringify({
          [key]: v,
        })).join('、');
      }
      return JSON.stringify({ [key]: value });
    });
  }
}
