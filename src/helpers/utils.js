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
        return value.map(v => `@${JSON.stringify({ [key]: v })}@`).join('、');
      }
      return `@${JSON.stringify({ [key]: value })}@`;
    });
  }
}

export function has(Arr, o) {
  if (typeof o === 'object') {
    return Arr.some(v => typeof v === 'object' && v.id === o.id);
  }
  return Arr.some(v => v === o);
}

export function diffArray(oldArr, newArr) {
  const deleted = oldArr.filter(v => !has(newArr, v));
  const added = newArr.filter(v => !has(oldArr, v));
  return { deleted, added };
}

export function unique(arr) {
  const uniqueSet = new Set(arr);
  const result = [];
  uniqueSet.forEach(v => result.push(v));
  return result;
}

export function analyzeLog(type, logString) {
  const regExp = /@[^@]+@/g;
  const logType = logTypes[type].match(/\w+[^\s]/g);
  const logArr = logString.match(regExp).map(v => v.replace(/@/g, ''));
  const logs = {};
  if (logType.length > 1) {
    logType.forEach((v, i) => Object.assign(logs, JSON.parse(logArr[i])));
    return logs;
  }

  const key = logType[0];
  logs[key] = logArr.map(v => JSON.parse(v)[key]);
  return logs;
}
