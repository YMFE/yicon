export const versionTools = {
  v2n(version) {
    return version.split('.')
      .reduce((p, n, i) => p + n * Math.pow(100, 2 - i), 0);
  },
  n2v(num) {
    return (num / 1000000)
      .toFixed(6).match(/\d{2}/g).map(d => +d)
      .join('.');
  },
};
