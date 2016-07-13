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
};

export const isPlainObject = obj => {
  try {
    return JSON.stringify(obj) === '{}';
  } catch (e) {
    return false;
  }
};
