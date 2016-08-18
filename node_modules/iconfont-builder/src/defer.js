// defer-polyfill
module.exports = function() {
  var defer = {};
  var promise = new Promise(function(resolve, reject) {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  defer.promise = promise;
  return defer;
};