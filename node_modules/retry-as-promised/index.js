var debug = require('debug')('retry-as-promised')
  , error = require('debug')('retry-as-promised:error')
  , Promise = require('bluebird');

module.exports = function retryAsPromised(callback, options) {
  if (!callback || !options) throw new Error('retry-as-promised must be passed a callback and a options set or a number');

  if (typeof options === 'number') {
    options = {max: options};
  }

  // Super cheap clone
  options = {
    $current: options.$current || 1,
    max: options.max,
    timeout: options.timeout || undefined,
    match: options.match || [],
    backoffBase: options.backoffBase === undefined ? 100 : options.backoffBase,
    backoffExponent: options.backoffExponent || 1.1
  };
  
  // Massage match option into array so we can blindly treat it as such later
  if (!Array.isArray(options.match)) options.match = [options.match];

  debug('Trying '+callback.name+' (%s)', options.$current);

  return new Promise(function (resolve, reject) {
    var timeout
      , backoffTimeout;

    if (options.timeout) {
      timeout = setTimeout(function () {
        if (backoffTimeout) clearTimeout(backoffTimeout);
        reject(Promise.TimeoutError(callback.name + ' timed out'));
      }, options.timeout);
    }

    Promise.resolve(callback()).then(resolve).tap(function () {
      if (timeout) clearTimeout(timeout);
      if (backoffTimeout) clearTimeout(backoffTimeout);
    }).catch(function (err) {
      if (timeout) clearTimeout(timeout);
      if (backoffTimeout) clearTimeout(backoffTimeout);

      error(err && err.toString() || err);
      
      // Should not retry if max has been reached
      var shouldRetry = options.$current < options.max; 
      
      if (shouldRetry && options.match.length && err) {
        // If match is defined we should fail if it is not met
        shouldRetry = options.match.reduce(function (shouldRetry, match) {
          if (shouldRetry) return shouldRetry;

          if (match === err.toString() ||
              match === err.message ||
              typeof match === "function" && err instanceof match
          ) {
            shouldRetry = true;
          }
          return shouldRetry;
        }, false);
      }

      if (!shouldRetry) return reject(err);

      // Do some accounting
      options.$current++;
      
      if (options.backoffBase) {
        // Use backoff function to ease retry rate
        options.backoffBase = Math.pow(options.backoffBase, options.backoffExponent);
        debug('Delaying retry of '+callback.name+' by %s', options.backoffBase);
        backoffTimeout = setTimeout(function() {
          retryAsPromised(callback, options).then(resolve).catch(reject);
        }, options.backoffBase);
      } else {
        retryAsPromised(callback, options).then(resolve).catch(reject);
      }

    });
  });
};

