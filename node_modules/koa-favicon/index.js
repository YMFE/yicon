
/**
 * Module dependencies.
 */

var resolve = require('path').resolve;
var fs = require('mz/fs');

/**
 * Serve favicon.ico
 *
 * @param {String} path
 * @param {Object} [options]
 * @return {Function}
 * @api public
 */

module.exports = function (path, options){
  var icon;

  if (path) path = resolve(path);
  options = options || {};

  var maxAge = options.maxAge == null
    ? 86400000
    : Math.min(Math.max(0, options.maxAge), 31556926000);

  return function *favicon(next){
    if ('/favicon.ico' != this.path) return yield next;

    if (!path) return;

    if ('GET' !== this.method && 'HEAD' !== this.method) {
      this.status = 'OPTIONS' == this.method ? 200 : 405;
      this.set('Allow', 'GET, HEAD, OPTIONS');
      return;
    }

    if (!icon) icon = yield fs.readFile(path);

    this.set('Cache-Control', 'public, max-age=' + (maxAge / 1000 | 0));
    this.type = 'image/x-icon';
    this.body = icon;
  };
};
