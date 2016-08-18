'use strict';

exports.__esModule = true;
exports.default = ignore;
exports.hasValidExtension = hasValidExtension;

var _path = require('path');

var _es6Set = require('es6-set');

var _es6Set2 = _interopRequireDefault(_es6Set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// one-shot memoized
var cachedSet = void 0,
    lastSettings = void 0;
function validExtensions(_ref) {
  var settings = _ref.settings;

  if (cachedSet && settings === lastSettings) {
    return cachedSet;
  }

  // todo: add 'mjs'?
  lastSettings = settings;
  // breaking: default to '.js'
  // cachedSet = new Set(settings['import/extensions'] || [ '.js' ])
  cachedSet = 'import/extensions' in settings ? new _es6Set2.default(settings['import/extensions']) : { has: function has() {
      return true;
    } }; // the set of all elements

  return cachedSet;
}

function ignore(path, context) {
  // ignore node_modules by default
  var ignoreStrings = context.settings['import/ignore'] ? [].concat(context.settings['import/ignore']) : ['node_modules'];

  // check extension list first (cheap)
  if (!hasValidExtension(path, context)) return true;

  if (ignoreStrings.length === 0) return false;

  for (var i = 0; i < ignoreStrings.length; i++) {
    var regex = new RegExp(ignoreStrings[i]);
    if (regex.test(path)) return true;
  }

  return false;
}

function hasValidExtension(path, context) {
  return validExtensions(context).has((0, _path.extname)(path));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvaWdub3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztrQkFxQndCLE07UUFtQlIsaUIsR0FBQSxpQjs7QUF4Q2hCOztBQUNBOzs7Ozs7QUFFQTtBQUNBLElBQUksa0JBQUo7QUFBQSxJQUFlLHFCQUFmO0FBQ0EsU0FBUyxlQUFULE9BQXVDO0FBQUEsTUFBWixRQUFZLFFBQVosUUFBWTs7QUFDckMsTUFBSSxhQUFhLGFBQWEsWUFBOUIsRUFBNEM7QUFDMUMsV0FBTyxTQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxpQkFBZSxRQUFmO0FBQ0E7QUFDQTtBQUNBLGNBQVksdUJBQXVCLFFBQXZCLEdBQ1IscUJBQVEsU0FBUyxtQkFBVCxDQUFSLENBRFEsR0FFUixFQUFFLEtBQUs7QUFBQSxhQUFNLElBQU47QUFBQSxLQUFQLEVBRkosQ0FUcUMsQ0FXYjs7QUFFeEIsU0FBTyxTQUFQO0FBQ0Q7O0FBRWMsU0FBUyxNQUFULENBQWdCLElBQWhCLEVBQXNCLE9BQXRCLEVBQStCO0FBQzVDO0FBQ0EsTUFBTSxnQkFBZ0IsUUFBUSxRQUFSLENBQWlCLGVBQWpCLElBQ2xCLEdBQUcsTUFBSCxDQUFVLFFBQVEsUUFBUixDQUFpQixlQUFqQixDQUFWLENBRGtCLEdBRWxCLENBQUMsY0FBRCxDQUZKOztBQUlBO0FBQ0EsTUFBSSxDQUFDLGtCQUFrQixJQUFsQixFQUF3QixPQUF4QixDQUFMLEVBQXVDLE9BQU8sSUFBUDs7QUFFdkMsTUFBSSxjQUFjLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0MsT0FBTyxLQUFQOztBQUVoQyxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksY0FBYyxNQUFsQyxFQUEwQyxHQUExQyxFQUErQztBQUM3QyxRQUFJLFFBQVEsSUFBSSxNQUFKLENBQVcsY0FBYyxDQUFkLENBQVgsQ0FBWjtBQUNBLFFBQUksTUFBTSxJQUFOLENBQVcsSUFBWCxDQUFKLEVBQXNCLE9BQU8sSUFBUDtBQUN2Qjs7QUFFRCxTQUFPLEtBQVA7QUFDRDs7QUFFTSxTQUFTLGlCQUFULENBQTJCLElBQTNCLEVBQWlDLE9BQWpDLEVBQTBDO0FBQy9DLFNBQU8sZ0JBQWdCLE9BQWhCLEVBQXlCLEdBQXpCLENBQTZCLG1CQUFRLElBQVIsQ0FBN0IsQ0FBUDtBQUNEIiwiZmlsZSI6ImNvcmUvaWdub3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXh0bmFtZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgU2V0IGZyb20gJ2VzNi1zZXQnXG5cbi8vIG9uZS1zaG90IG1lbW9pemVkXG5sZXQgY2FjaGVkU2V0LCBsYXN0U2V0dGluZ3NcbmZ1bmN0aW9uIHZhbGlkRXh0ZW5zaW9ucyh7IHNldHRpbmdzIH0pIHtcbiAgaWYgKGNhY2hlZFNldCAmJiBzZXR0aW5ncyA9PT0gbGFzdFNldHRpbmdzKSB7XG4gICAgcmV0dXJuIGNhY2hlZFNldFxuICB9XG5cbiAgLy8gdG9kbzogYWRkICdtanMnP1xuICBsYXN0U2V0dGluZ3MgPSBzZXR0aW5nc1xuICAvLyBicmVha2luZzogZGVmYXVsdCB0byAnLmpzJ1xuICAvLyBjYWNoZWRTZXQgPSBuZXcgU2V0KHNldHRpbmdzWydpbXBvcnQvZXh0ZW5zaW9ucyddIHx8IFsgJy5qcycgXSlcbiAgY2FjaGVkU2V0ID0gJ2ltcG9ydC9leHRlbnNpb25zJyBpbiBzZXR0aW5nc1xuICAgID8gbmV3IFNldChzZXR0aW5nc1snaW1wb3J0L2V4dGVuc2lvbnMnXSlcbiAgICA6IHsgaGFzOiAoKSA9PiB0cnVlIH0gLy8gdGhlIHNldCBvZiBhbGwgZWxlbWVudHNcblxuICByZXR1cm4gY2FjaGVkU2V0XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlnbm9yZShwYXRoLCBjb250ZXh0KSB7XG4gIC8vIGlnbm9yZSBub2RlX21vZHVsZXMgYnkgZGVmYXVsdFxuICBjb25zdCBpZ25vcmVTdHJpbmdzID0gY29udGV4dC5zZXR0aW5nc1snaW1wb3J0L2lnbm9yZSddXG4gICAgPyBbXS5jb25jYXQoY29udGV4dC5zZXR0aW5nc1snaW1wb3J0L2lnbm9yZSddKVxuICAgIDogWydub2RlX21vZHVsZXMnXVxuXG4gIC8vIGNoZWNrIGV4dGVuc2lvbiBsaXN0IGZpcnN0IChjaGVhcClcbiAgaWYgKCFoYXNWYWxpZEV4dGVuc2lvbihwYXRoLCBjb250ZXh0KSkgcmV0dXJuIHRydWVcblxuICBpZiAoaWdub3JlU3RyaW5ncy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaWdub3JlU3RyaW5ncy5sZW5ndGg7IGkrKykge1xuICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoaWdub3JlU3RyaW5nc1tpXSlcbiAgICBpZiAocmVnZXgudGVzdChwYXRoKSkgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHJldHVybiBmYWxzZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzVmFsaWRFeHRlbnNpb24ocGF0aCwgY29udGV4dCkge1xuICByZXR1cm4gdmFsaWRFeHRlbnNpb25zKGNvbnRleHQpLmhhcyhleHRuYW1lKHBhdGgpKVxufVxuIl19