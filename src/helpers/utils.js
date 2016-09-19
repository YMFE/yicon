import { logTypes } from '../constants/utils';
import { VERSION } from '../constants/validate';
import invariant from 'invariant';

export const versionTools = {
  v2n(version) {
    invariant(VERSION.reg.test(version), `传入的版本号 ${version} 不合法`);
    return version.split('.')
      .reduce((p, n, i) => p + n * Math.pow(1000, 2 - i), 0);
  },
  n2v(num) {
    invariant(!isNaN(num), `传入的数字 ${num} 不合法`);
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

export const parseVersionCompareParam = param => {
  const reg = /(\d+\.\d+\.\d+)\.\.\.(\d+\.\d+\.\d+)/;
  const matched = param.match(reg);
  if (!matched) return null;
  return {
    from: matched[1],
    to: matched[2],
  };
};

export function has(Arr, o) {
  if (typeof o === 'object') {
    return Arr.some(v => typeof v === 'object' && v.id === o.id);
  }
  return Arr.some(v => v === o);
}

export function diffArray(oldArr, newArr, getReplaced = false) {
  const replaced = [];
  const deleted = oldArr.filter(v => !has(newArr, v));
  const added = newArr.filter(v => {
    if (getReplaced) {
      oldArr.forEach(value => {
        if (v.oldId === value.id) {
          replaced.push({ old: value, new: v });
        }
      });
    }
    return !has(oldArr, v);
  });
  if (getReplaced) return { deleted, added, replaced };
  return { deleted, added };
}

export function unique(arr) {
  const uniqueSet = new Set(arr);
  const result = [];
  uniqueSet.forEach(v => result.push(v));
  return result;
}

// ============ 日志处理方法 ============ //
export function generateLog(type, data = {}) {
  const param = {};
  if (Object.keys(logTypes).indexOf(type) === -1) {
    return '';
  }
  const text = logTypes[type];
  return text.replace(/@(\w+)/g, (matched, key) => {
    const value = data[key];
    invariant(value, `日志缺少参数，期望存在 ${key}`);
    param[key] = value;
    if (Array.isArray(value)) {
      invariant(value.length, `日志参数 ${key} 为空数组`);
      return value.map(v => `@${JSON.stringify({ [key]: v })}@`).join('、');
    }
    return `@${JSON.stringify({ [key]: value })}@`;
  });
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

export function getPageTitle(components) {
  let title = 'yicon - 矢量图标字体库';
  components.some(c => {
    if (typeof c.appPageTitle === 'string') {
      title = c.appPageTitle;
      return true;
    }
    return false;
  });

  return title;
}

const reg = /\{\{(\w+)\}\}/g;

export function simpleParse(template, data) {
  return template.replace(reg, (_, m) => data[m]);
}
