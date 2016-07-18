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
      case 'revision':
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
    if (Object.keys(logTypes).indexOf(type) === -1) {
      return;
    }
    this.text = logTypes[type];
    this.text = this.text.replace(/@(\w+)/g, (matched, key) => {
      const value = data[key];
      if (!value) throw new Error('日志缺少参数');
      this.param[key] = value;
      if (Array.isArray(value)) {
        if (!value.length) throw new Error('日志缺少参数');
        return value.map(v => JSON.stringify({
          [key]: v,
        })).join('、');
      }
      return JSON.stringify({ [key]: value });
    });
  }
}

export function has(Arr, o) {
  let result = false;
  if (typeof o === 'object') {
    result = Arr.some(v => typeof v === 'object' && v.id === o.id);
  } else {
    result = Arr.some(v => v === o);
  }
  return result;
}

export function diffArray(oldArr, newArr) {
  const deleted = oldArr.filter(v => !has(newArr, v));
  const added = newArr.filter(v => !has(oldArr, v));
  return { deleted, added };
}
