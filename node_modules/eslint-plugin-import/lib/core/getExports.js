'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.recursivePatternCapture = recursivePatternCapture;

var _es6Map = require('es6-map');

var _es6Map2 = _interopRequireDefault(_es6Map);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _crypto = require('crypto');

var _doctrine = require('doctrine');

var doctrine = _interopRequireWildcard(_doctrine);

var _parse2 = require('./parse');

var _parse3 = _interopRequireDefault(_parse2);

var _resolve = require('./resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _ignore = require('./ignore');

var _ignore2 = _interopRequireDefault(_ignore);

var _hash = require('./hash');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var exportCache = new _es6Map2.default();

/**
 * detect exports without a full parse.
 * used primarily to ignore the import/ignore setting, iif it looks like
 * there might be something there (i.e., jsnext:main is set).
 * @type {RegExp}
 */
var hasExports = new RegExp('(^|[\\n;])\\s*export\\s[\\w{*]');

var ExportMap = function () {
  function ExportMap(path) {
    _classCallCheck(this, ExportMap);

    this.path = path;
    this.namespace = new _es6Map2.default();
    // todo: restructure to key on path, value is resolver + map of names
    this.reexports = new _es6Map2.default();
    this.dependencies = new _es6Map2.default();
    this.errors = [];
  }

  ExportMap.get = function get(source, context) {

    var path = (0, _resolve2.default)(source, context);
    if (path == null) return null;

    return ExportMap.for(path, context);
  };

  ExportMap.for = function _for(path, context) {
    var exportMap = void 0;

    var cacheKey = (0, _hash.hashObject)((0, _crypto.createHash)('sha256'), {
      settings: context.settings,
      parserPath: context.parserPath,
      parserOptions: context.parserOptions,
      path: path
    }).digest('hex');

    exportMap = exportCache.get(cacheKey);

    // return cached ignore
    if (exportMap === null) return null;

    var stats = fs.statSync(path);
    if (exportMap != null) {
      // date equality check
      if (exportMap.mtime - stats.mtime === 0) {
        return exportMap;
      }
      // future: check content equality?
    }

    // check valid extensions first
    if (!(0, _ignore.hasValidExtension)(path, context)) {
      exportCache.set(cacheKey, null);
      return null;
    }

    var content = fs.readFileSync(path, { encoding: 'utf8' });

    // check for and cache ignore
    if ((0, _ignore2.default)(path, context) && !hasExports.test(content)) {
      exportCache.set(cacheKey, null);
      return null;
    }

    exportMap = ExportMap.parse(path, content, context);
    exportMap.mtime = stats.mtime;

    exportCache.set(cacheKey, exportMap);
    return exportMap;
  };

  ExportMap.parse = function parse(path, content, context) {
    var m = new ExportMap(path);

    try {
      var ast = (0, _parse3.default)(content, context);
    } catch (err) {
      m.errors.push(err);
      return m; // can't continue
    }

    var docstyle = context.settings && context.settings['import/docstyle'] || ['jsdoc'];
    var docStyleParsers = {};
    docstyle.forEach(function (style) {
      docStyleParsers[style] = availableDocStyleParsers[style];
    });

    // attempt to collect module doc
    ast.comments.some(function (c) {
      if (c.type !== 'Block') return false;
      try {
        var doc = doctrine.parse(c.value, { unwrap: true });
        if (doc.tags.some(function (t) {
          return t.title === 'module';
        })) {
          m.doc = doc;
          return true;
        }
      } catch (err) {/* ignore */}
      return false;
    });

    var namespaces = new _es6Map2.default();

    function remotePath(node) {
      return (0, _resolve.relative)(node.source.value, path, context.settings);
    }

    function resolveImport(node) {
      var rp = remotePath(node);
      if (rp == null) return null;
      return ExportMap.for(rp, context);
    }

    function getNamespace(identifier) {
      if (!namespaces.has(identifier.name)) return;

      return function () {
        return resolveImport(namespaces.get(identifier.name));
      };
    }

    function addNamespace(object, identifier) {
      var nsfn = getNamespace(identifier);
      if (nsfn) {
        Object.defineProperty(object, 'namespace', { get: nsfn });
      }

      return object;
    }

    ast.body.forEach(function (n) {

      if (n.type === 'ExportDefaultDeclaration') {
        var exportMeta = captureDoc(docStyleParsers, n);
        if (n.declaration.type === 'Identifier') {
          addNamespace(exportMeta, n.declaration);
        }
        m.namespace.set('default', exportMeta);
        return;
      }

      if (n.type === 'ExportAllDeclaration') {
        var _ret = function () {
          var remoteMap = remotePath(n);
          if (remoteMap == null) return {
              v: void 0
            };
          m.dependencies.set(remoteMap, function () {
            return ExportMap.for(remoteMap, context);
          });
          return {
            v: void 0
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }

      // capture namespaces in case of later export
      if (n.type === 'ImportDeclaration') {
        var ns = void 0;
        if (n.specifiers.some(function (s) {
          return s.type === 'ImportNamespaceSpecifier' && (ns = s);
        })) {
          namespaces.set(ns.local.name, n);
        }
        return;
      }

      if (n.type === 'ExportNamedDeclaration') {
        // capture declaration
        if (n.declaration != null) {
          switch (n.declaration.type) {
            case 'FunctionDeclaration':
            case 'ClassDeclaration':
            case 'TypeAlias':
              // flowtype with babel-eslint parser
              m.namespace.set(n.declaration.id.name, captureDoc(docStyleParsers, n));
              break;
            case 'VariableDeclaration':
              n.declaration.declarations.forEach(function (d) {
                return recursivePatternCapture(d.id, function (id) {
                  return m.namespace.set(id.name, captureDoc(docStyleParsers, d, n));
                });
              });
              break;
          }
        }

        n.specifiers.forEach(function (s) {
          var exportMeta = {};
          var local = void 0;

          switch (s.type) {
            case 'ExportDefaultSpecifier':
              if (!n.source) return;
              local = 'default';
              break;
            case 'ExportNamespaceSpecifier':
              m.namespace.set(s.exported.name, Object.defineProperty(exportMeta, 'namespace', {
                get: function get() {
                  return resolveImport(n);
                }
              }));
              return;
            case 'ExportSpecifier':
              if (!n.source) {
                m.namespace.set(s.exported.name, addNamespace(exportMeta, s.local));
                return;
              }
            // else falls through
            default:
              local = s.local.name;
              break;
          }

          // todo: JSDoc
          m.reexports.set(s.exported.name, { local: local, getImport: function getImport() {
              return resolveImport(n);
            } });
        });
      }
    });

    return m;
  };

  /**
   * Note that this does not check explicitly re-exported names for existence
   * in the base namespace, but it will expand all `export * from '...'` exports
   * if not found in the explicit namespace.
   * @param  {string}  name
   * @return {Boolean} true if `name` is exported by this module.
   */


  ExportMap.prototype.has = function has(name) {
    if (this.namespace.has(name)) return true;
    if (this.reexports.has(name)) return true;

    // default exports must be explicitly re-exported (#328)
    var foundInnerMapName = false;
    if (name !== 'default') {
      this.dependencies.forEach(function (dep) {
        if (!foundInnerMapName) {
          var innerMap = dep();

          // todo: report as unresolved?
          if (innerMap && innerMap.has(name)) foundInnerMapName = true;
        }
      });
    }

    return foundInnerMapName;
  };

  /**
   * ensure that imported name fully resolves.
   * @param  {[type]}  name [description]
   * @return {Boolean}      [description]
   */


  ExportMap.prototype.hasDeep = function hasDeep(name) {
    var _this = this;

    if (this.namespace.has(name)) return { found: true, path: [this] };

    if (this.reexports.has(name)) {
      var _reexports$get = this.reexports.get(name);

      var local = _reexports$get.local;
      var getImport = _reexports$get.getImport;
      var imported = getImport();

      // if import is ignored, return explicit 'null'
      if (imported == null) return { found: true, path: [this] };

      // safeguard against cycles, only if name matches
      if (imported.path === this.path && local === name) return { found: false, path: [this] };

      var deep = imported.hasDeep(local);
      deep.path.unshift(this);

      return deep;
    }

    // default exports must be explicitly re-exported (#328)
    var returnValue = { found: false, path: [this] };
    if (name !== 'default') {
      this.dependencies.forEach(function (dep) {
        if (!returnValue.found) {
          var innerMap = dep();
          // todo: report as unresolved?
          if (innerMap) {

            // safeguard against cycles
            if (innerMap.path !== _this.path) {

              var innerValue = innerMap.hasDeep(name);
              if (innerValue.found) {
                innerValue.path.unshift(_this);
                returnValue = innerValue;
              }
            }
          }
        }
      });
    }

    return returnValue;
  };

  ExportMap.prototype.get = function get(name) {
    var _this2 = this;

    if (this.namespace.has(name)) return this.namespace.get(name);

    if (this.reexports.has(name)) {
      var _reexports$get2 = this.reexports.get(name);

      var local = _reexports$get2.local;
      var getImport = _reexports$get2.getImport;
      var imported = getImport();

      // if import is ignored, return explicit 'null'
      if (imported == null) return null;

      // safeguard against cycles, only if name matches
      if (imported.path === this.path && local === name) return undefined;

      return imported.get(local);
    }

    // default exports must be explicitly re-exported (#328)
    var returnValue = undefined;
    if (name !== 'default') {
      this.dependencies.forEach(function (dep) {
        if (returnValue === undefined) {
          var innerMap = dep();
          // todo: report as unresolved?
          if (innerMap) {

            // safeguard against cycles
            if (innerMap.path !== _this2.path) {

              var innerValue = innerMap.get(name);
              if (innerValue !== undefined) returnValue = innerValue;
            }
          }
        }
      });
    }

    return returnValue;
  };

  ExportMap.prototype.forEach = function forEach(callback, thisArg) {
    var _this3 = this;

    this.namespace.forEach(function (v, n) {
      return callback.call(thisArg, v, n, _this3);
    });

    this.reexports.forEach(function (_ref, name) {
      var getImport = _ref.getImport;
      var local = _ref.local;

      var reexported = getImport();
      // can't look up meta for ignored re-exports (#348)
      callback.call(thisArg, reexported && reexported.get(local), name, _this3);
    });

    this.dependencies.forEach(function (dep) {
      return dep().forEach(function (v, n) {
        return n !== 'default' && callback.call(thisArg, v, n, _this3);
      });
    });
  };

  // todo: keys, values, entries?

  ExportMap.prototype.reportErrors = function reportErrors(context, declaration) {
    context.report({
      node: declaration.source,
      message: 'Parse errors in imported module \'' + declaration.source.value + '\': ' + ('' + this.errors.map(function (e) {
        return e.message + ' (' + e.lineNumber + ':' + e.column + ')';
      }).join(', '))
    });
  };

  _createClass(ExportMap, [{
    key: 'hasDefault',
    get: function get() {
      return this.get('default') != null;
    } // stronger than this.has

  }, {
    key: 'size',
    get: function get() {
      var size = this.namespace.size + this.reexports.size;
      this.dependencies.forEach(function (dep) {
        return size += dep().size;
      });
      return size;
    }
  }]);

  return ExportMap;
}();

/**
 * parse docs from the first node that has leading comments
 * @param  {...[type]} nodes [description]
 * @return {{doc: object}}
 */


exports.default = ExportMap;
function captureDoc(docStyleParsers) {
  var metadata = {};

  // 'some' short-circuits on first 'true'

  for (var _len = arguments.length, nodes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    nodes[_key - 1] = arguments[_key];
  }

  nodes.some(function (n) {
    if (!n.leadingComments) return false;

    for (var name in docStyleParsers) {
      var doc = docStyleParsers[name](n.leadingComments);
      if (doc) {
        metadata.doc = doc;
      }
    }

    return true;
  });

  return metadata;
}

var availableDocStyleParsers = {
  jsdoc: captureJsDoc,
  tomdoc: captureTomDoc
};

/**
 * parse JSDoc from leading comments
 * @param  {...[type]} comments [description]
 * @return {{doc: object}}
 */
function captureJsDoc(comments) {
  var doc = void 0;

  // capture XSDoc
  comments.forEach(function (comment) {
    // skip non-block comments
    if (comment.value.slice(0, 4) !== '*\n *') return;
    try {
      doc = doctrine.parse(comment.value, { unwrap: true });
    } catch (err) {
      /* don't care, for now? maybe add to `errors?` */
    }
  });

  return doc;
}

/**
  * parse TomDoc section from comments
  */
function captureTomDoc(comments) {
  // collect lines up to first paragraph break
  var lines = [];
  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i];
    if (comment.value.match(/^\s*$/)) break;
    lines.push(comment.value.trim());
  }

  // return doctrine-like object
  var statusMatch = lines.join(' ').match(/^(Public|Internal|Deprecated):\s*(.+)/);
  if (statusMatch) {
    return {
      description: statusMatch[2],
      tags: [{
        title: statusMatch[1].toLowerCase(),
        description: statusMatch[2]
      }]
    };
  }
}

/**
 * Traverse a pattern/identifier node, calling 'callback'
 * for each leaf identifier.
 * @param  {node}   pattern
 * @param  {Function} callback
 * @return {void}
 */
function recursivePatternCapture(pattern, callback) {
  switch (pattern.type) {
    case 'Identifier':
      // base case
      callback(pattern);
      break;

    case 'ObjectPattern':
      pattern.properties.forEach(function (_ref2) {
        var value = _ref2.value;

        recursivePatternCapture(value, callback);
      });
      break;

    case 'ArrayPattern':
      pattern.elements.forEach(function (element) {
        if (element == null) return;
        recursivePatternCapture(element, callback);
      });
      break;
  }
}
//# sourceMappingURL=data:application/json;base64,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QUVGLFNBQUssY0FBTDtBQUNFLGNBQVEsUUFBUixDQUFpQixPQUFqQixDQUF5QixVQUFDLE9BQUQsRUFBYTtBQUNwQyxZQUFJLFdBQVcsSUFBZixFQUFxQjtBQUNyQixnQ0FBd0IsT0FBeEIsRUFBaUMsUUFBakM7QUFDRCxPQUhEO0FBSUE7QUFoQko7QUFrQkQiLCJmaWxlIjoiY29yZS9nZXRFeHBvcnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1hcCBmcm9tICdlczYtbWFwJ1xuXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcydcblxuaW1wb3J0IHsgY3JlYXRlSGFzaCB9IGZyb20gJ2NyeXB0bydcbmltcG9ydCAqIGFzIGRvY3RyaW5lIGZyb20gJ2RvY3RyaW5lJ1xuXG5pbXBvcnQgcGFyc2UgZnJvbSAnLi9wYXJzZSdcbmltcG9ydCByZXNvbHZlLCB7IHJlbGF0aXZlIGFzIHJlc29sdmVSZWxhdGl2ZSB9IGZyb20gJy4vcmVzb2x2ZSdcbmltcG9ydCBpc0lnbm9yZWQsIHsgaGFzVmFsaWRFeHRlbnNpb24gfSBmcm9tICcuL2lnbm9yZSdcblxuaW1wb3J0IHsgaGFzaE9iamVjdCB9IGZyb20gJy4vaGFzaCdcblxuY29uc3QgZXhwb3J0Q2FjaGUgPSBuZXcgTWFwKClcblxuLyoqXG4gKiBkZXRlY3QgZXhwb3J0cyB3aXRob3V0IGEgZnVsbCBwYXJzZS5cbiAqIHVzZWQgcHJpbWFyaWx5IHRvIGlnbm9yZSB0aGUgaW1wb3J0L2lnbm9yZSBzZXR0aW5nLCBpaWYgaXQgbG9va3MgbGlrZVxuICogdGhlcmUgbWlnaHQgYmUgc29tZXRoaW5nIHRoZXJlIChpLmUuLCBqc25leHQ6bWFpbiBpcyBzZXQpLlxuICogQHR5cGUge1JlZ0V4cH1cbiAqL1xuY29uc3QgaGFzRXhwb3J0cyA9IG5ldyBSZWdFeHAoJyhefFtcXFxcbjtdKVxcXFxzKmV4cG9ydFxcXFxzW1xcXFx3eypdJylcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhwb3J0TWFwIHtcbiAgY29uc3RydWN0b3IocGF0aCkge1xuICAgIHRoaXMucGF0aCA9IHBhdGhcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG5ldyBNYXAoKVxuICAgIC8vIHRvZG86IHJlc3RydWN0dXJlIHRvIGtleSBvbiBwYXRoLCB2YWx1ZSBpcyByZXNvbHZlciArIG1hcCBvZiBuYW1lc1xuICAgIHRoaXMucmVleHBvcnRzID0gbmV3IE1hcCgpXG4gICAgdGhpcy5kZXBlbmRlbmNpZXMgPSBuZXcgTWFwKClcbiAgICB0aGlzLmVycm9ycyA9IFtdXG4gIH1cblxuICBnZXQgaGFzRGVmYXVsdCgpIHsgcmV0dXJuIHRoaXMuZ2V0KCdkZWZhdWx0JykgIT0gbnVsbCB9IC8vIHN0cm9uZ2VyIHRoYW4gdGhpcy5oYXNcblxuICBnZXQgc2l6ZSgpIHtcbiAgICBsZXQgc2l6ZSA9IHRoaXMubmFtZXNwYWNlLnNpemUgKyB0aGlzLnJlZXhwb3J0cy5zaXplXG4gICAgdGhpcy5kZXBlbmRlbmNpZXMuZm9yRWFjaChkZXAgPT4gc2l6ZSArPSBkZXAoKS5zaXplKVxuICAgIHJldHVybiBzaXplXG4gIH1cblxuICBzdGF0aWMgZ2V0KHNvdXJjZSwgY29udGV4dCkge1xuXG4gICAgdmFyIHBhdGggPSByZXNvbHZlKHNvdXJjZSwgY29udGV4dClcbiAgICBpZiAocGF0aCA9PSBudWxsKSByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIEV4cG9ydE1hcC5mb3IocGF0aCwgY29udGV4dClcbiAgfVxuXG4gIHN0YXRpYyBmb3IocGF0aCwgY29udGV4dCkge1xuICAgIGxldCBleHBvcnRNYXBcblxuICAgIGNvbnN0IGNhY2hlS2V5ID0gaGFzaE9iamVjdChjcmVhdGVIYXNoKCdzaGEyNTYnKSwge1xuICAgICAgc2V0dGluZ3M6IGNvbnRleHQuc2V0dGluZ3MsXG4gICAgICBwYXJzZXJQYXRoOiBjb250ZXh0LnBhcnNlclBhdGgsXG4gICAgICBwYXJzZXJPcHRpb25zOiBjb250ZXh0LnBhcnNlck9wdGlvbnMsXG4gICAgICBwYXRoLFxuICAgIH0pLmRpZ2VzdCgnaGV4JylcblxuICAgIGV4cG9ydE1hcCA9IGV4cG9ydENhY2hlLmdldChjYWNoZUtleSlcblxuICAgIC8vIHJldHVybiBjYWNoZWQgaWdub3JlXG4gICAgaWYgKGV4cG9ydE1hcCA9PT0gbnVsbCkgcmV0dXJuIG51bGxcblxuICAgIGNvbnN0IHN0YXRzID0gZnMuc3RhdFN5bmMocGF0aClcbiAgICBpZiAoZXhwb3J0TWFwICE9IG51bGwpIHtcbiAgICAgIC8vIGRhdGUgZXF1YWxpdHkgY2hlY2tcbiAgICAgIGlmIChleHBvcnRNYXAubXRpbWUgLSBzdGF0cy5tdGltZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0TWFwXG4gICAgICB9XG4gICAgICAvLyBmdXR1cmU6IGNoZWNrIGNvbnRlbnQgZXF1YWxpdHk/XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgdmFsaWQgZXh0ZW5zaW9ucyBmaXJzdFxuICAgIGlmICghaGFzVmFsaWRFeHRlbnNpb24ocGF0aCwgY29udGV4dCkpIHtcbiAgICAgIGV4cG9ydENhY2hlLnNldChjYWNoZUtleSwgbnVsbClcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgY29uc3QgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfSlcblxuICAgIC8vIGNoZWNrIGZvciBhbmQgY2FjaGUgaWdub3JlXG4gICAgaWYgKGlzSWdub3JlZChwYXRoLCBjb250ZXh0KSAmJiAhaGFzRXhwb3J0cy50ZXN0KGNvbnRlbnQpKSB7XG4gICAgICBleHBvcnRDYWNoZS5zZXQoY2FjaGVLZXksIG51bGwpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGV4cG9ydE1hcCA9IEV4cG9ydE1hcC5wYXJzZShwYXRoLCBjb250ZW50LCBjb250ZXh0KVxuICAgIGV4cG9ydE1hcC5tdGltZSA9IHN0YXRzLm10aW1lXG5cbiAgICBleHBvcnRDYWNoZS5zZXQoY2FjaGVLZXksIGV4cG9ydE1hcClcbiAgICByZXR1cm4gZXhwb3J0TWFwXG4gIH1cblxuICBzdGF0aWMgcGFyc2UocGF0aCwgY29udGVudCwgY29udGV4dCkge1xuICAgIHZhciBtID0gbmV3IEV4cG9ydE1hcChwYXRoKVxuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBhc3QgPSBwYXJzZShjb250ZW50LCBjb250ZXh0KVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbS5lcnJvcnMucHVzaChlcnIpXG4gICAgICByZXR1cm4gbSAvLyBjYW4ndCBjb250aW51ZVxuICAgIH1cblxuICAgIGNvbnN0IGRvY3N0eWxlID0gKGNvbnRleHQuc2V0dGluZ3MgJiYgY29udGV4dC5zZXR0aW5nc1snaW1wb3J0L2RvY3N0eWxlJ10pIHx8IFsnanNkb2MnXVxuICAgIGNvbnN0IGRvY1N0eWxlUGFyc2VycyA9IHt9XG4gICAgZG9jc3R5bGUuZm9yRWFjaChzdHlsZSA9PiB7XG4gICAgICBkb2NTdHlsZVBhcnNlcnNbc3R5bGVdID0gYXZhaWxhYmxlRG9jU3R5bGVQYXJzZXJzW3N0eWxlXVxuICAgIH0pXG5cbiAgICAvLyBhdHRlbXB0IHRvIGNvbGxlY3QgbW9kdWxlIGRvY1xuICAgIGFzdC5jb21tZW50cy5zb21lKGMgPT4ge1xuICAgICAgaWYgKGMudHlwZSAhPT0gJ0Jsb2NrJykgcmV0dXJuIGZhbHNlXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkb2MgPSBkb2N0cmluZS5wYXJzZShjLnZhbHVlLCB7IHVud3JhcDogdHJ1ZSB9KVxuICAgICAgICBpZiAoZG9jLnRhZ3Muc29tZSh0ID0+IHQudGl0bGUgPT09ICdtb2R1bGUnKSkge1xuICAgICAgICAgIG0uZG9jID0gZG9jXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9KVxuXG4gICAgY29uc3QgbmFtZXNwYWNlcyA9IG5ldyBNYXAoKVxuXG4gICAgZnVuY3Rpb24gcmVtb3RlUGF0aChub2RlKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZVJlbGF0aXZlKG5vZGUuc291cmNlLnZhbHVlLCBwYXRoLCBjb250ZXh0LnNldHRpbmdzKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmVJbXBvcnQobm9kZSkge1xuICAgICAgY29uc3QgcnAgPSByZW1vdGVQYXRoKG5vZGUpXG4gICAgICBpZiAocnAgPT0gbnVsbCkgcmV0dXJuIG51bGxcbiAgICAgIHJldHVybiBFeHBvcnRNYXAuZm9yKHJwLCBjb250ZXh0KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE5hbWVzcGFjZShpZGVudGlmaWVyKSB7XG4gICAgICBpZiAoIW5hbWVzcGFjZXMuaGFzKGlkZW50aWZpZXIubmFtZSkpIHJldHVyblxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZUltcG9ydChuYW1lc3BhY2VzLmdldChpZGVudGlmaWVyLm5hbWUpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZE5hbWVzcGFjZShvYmplY3QsIGlkZW50aWZpZXIpIHtcbiAgICAgIGNvbnN0IG5zZm4gPSBnZXROYW1lc3BhY2UoaWRlbnRpZmllcilcbiAgICAgIGlmIChuc2ZuKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICduYW1lc3BhY2UnLCB7IGdldDogbnNmbiB9KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0XG4gICAgfVxuXG5cbiAgICBhc3QuYm9keS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG5cbiAgICAgIGlmIChuLnR5cGUgPT09ICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nKSB7XG4gICAgICAgIGNvbnN0IGV4cG9ydE1ldGEgPSBjYXB0dXJlRG9jKGRvY1N0eWxlUGFyc2VycywgbilcbiAgICAgICAgaWYgKG4uZGVjbGFyYXRpb24udHlwZSA9PT0gJ0lkZW50aWZpZXInKSB7XG4gICAgICAgICAgYWRkTmFtZXNwYWNlKGV4cG9ydE1ldGEsIG4uZGVjbGFyYXRpb24pXG4gICAgICAgIH1cbiAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KCdkZWZhdWx0JywgZXhwb3J0TWV0YSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChuLnR5cGUgPT09ICdFeHBvcnRBbGxEZWNsYXJhdGlvbicpIHtcbiAgICAgICAgbGV0IHJlbW90ZU1hcCA9IHJlbW90ZVBhdGgobilcbiAgICAgICAgaWYgKHJlbW90ZU1hcCA9PSBudWxsKSByZXR1cm5cbiAgICAgICAgbS5kZXBlbmRlbmNpZXMuc2V0KHJlbW90ZU1hcCwgKCkgPT4gRXhwb3J0TWFwLmZvcihyZW1vdGVNYXAsIGNvbnRleHQpKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gY2FwdHVyZSBuYW1lc3BhY2VzIGluIGNhc2Ugb2YgbGF0ZXIgZXhwb3J0XG4gICAgICBpZiAobi50eXBlID09PSAnSW1wb3J0RGVjbGFyYXRpb24nKSB7XG4gICAgICAgIGxldCBuc1xuICAgICAgICBpZiAobi5zcGVjaWZpZXJzLnNvbWUocyA9PiBzLnR5cGUgPT09ICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInICYmIChucyA9IHMpKSkge1xuICAgICAgICAgIG5hbWVzcGFjZXMuc2V0KG5zLmxvY2FsLm5hbWUsIG4pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChuLnR5cGUgPT09ICdFeHBvcnROYW1lZERlY2xhcmF0aW9uJyl7XG4gICAgICAgIC8vIGNhcHR1cmUgZGVjbGFyYXRpb25cbiAgICAgICAgaWYgKG4uZGVjbGFyYXRpb24gIT0gbnVsbCkge1xuICAgICAgICAgIHN3aXRjaCAobi5kZWNsYXJhdGlvbi50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdGdW5jdGlvbkRlY2xhcmF0aW9uJzpcbiAgICAgICAgICAgIGNhc2UgJ0NsYXNzRGVjbGFyYXRpb24nOlxuICAgICAgICAgICAgY2FzZSAnVHlwZUFsaWFzJzogLy8gZmxvd3R5cGUgd2l0aCBiYWJlbC1lc2xpbnQgcGFyc2VyXG4gICAgICAgICAgICAgIG0ubmFtZXNwYWNlLnNldChuLmRlY2xhcmF0aW9uLmlkLm5hbWUsIGNhcHR1cmVEb2MoZG9jU3R5bGVQYXJzZXJzLCBuKSlcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ1ZhcmlhYmxlRGVjbGFyYXRpb24nOlxuICAgICAgICAgICAgICBuLmRlY2xhcmF0aW9uLmRlY2xhcmF0aW9ucy5mb3JFYWNoKChkKSA9PlxuICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKGQuaWQsIGlkID0+XG4gICAgICAgICAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQoaWQubmFtZSwgY2FwdHVyZURvYyhkb2NTdHlsZVBhcnNlcnMsIGQsIG4pKSkpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbi5zcGVjaWZpZXJzLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAgICBjb25zdCBleHBvcnRNZXRhID0ge31cbiAgICAgICAgICBsZXQgbG9jYWxcblxuICAgICAgICAgIHN3aXRjaCAocy50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdFeHBvcnREZWZhdWx0U3BlY2lmaWVyJzpcbiAgICAgICAgICAgICAgaWYgKCFuLnNvdXJjZSkgcmV0dXJuXG4gICAgICAgICAgICAgIGxvY2FsID0gJ2RlZmF1bHQnXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdFeHBvcnROYW1lc3BhY2VTcGVjaWZpZXInOlxuICAgICAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQocy5leHBvcnRlZC5uYW1lLCBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0TWV0YSwgJ25hbWVzcGFjZScsIHtcbiAgICAgICAgICAgICAgICBnZXQoKSB7IHJldHVybiByZXNvbHZlSW1wb3J0KG4pIH0sXG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIGNhc2UgJ0V4cG9ydFNwZWNpZmllcic6XG4gICAgICAgICAgICAgIGlmICghbi5zb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQocy5leHBvcnRlZC5uYW1lLCBhZGROYW1lc3BhY2UoZXhwb3J0TWV0YSwgcy5sb2NhbCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gZWxzZSBmYWxscyB0aHJvdWdoXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBsb2NhbCA9IHMubG9jYWwubmFtZVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHRvZG86IEpTRG9jXG4gICAgICAgICAgbS5yZWV4cG9ydHMuc2V0KHMuZXhwb3J0ZWQubmFtZSwgeyBsb2NhbCwgZ2V0SW1wb3J0OiAoKSA9PiByZXNvbHZlSW1wb3J0KG4pIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBtXG4gIH1cblxuICAvKipcbiAgICogTm90ZSB0aGF0IHRoaXMgZG9lcyBub3QgY2hlY2sgZXhwbGljaXRseSByZS1leHBvcnRlZCBuYW1lcyBmb3IgZXhpc3RlbmNlXG4gICAqIGluIHRoZSBiYXNlIG5hbWVzcGFjZSwgYnV0IGl0IHdpbGwgZXhwYW5kIGFsbCBgZXhwb3J0ICogZnJvbSAnLi4uJ2AgZXhwb3J0c1xuICAgKiBpZiBub3QgZm91bmQgaW4gdGhlIGV4cGxpY2l0IG5hbWVzcGFjZS5cbiAgICogQHBhcmFtICB7c3RyaW5nfSAgbmFtZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGBuYW1lYCBpcyBleHBvcnRlZCBieSB0aGlzIG1vZHVsZS5cbiAgICovXG4gIGhhcyhuYW1lKSB7XG4gICAgaWYgKHRoaXMubmFtZXNwYWNlLmhhcyhuYW1lKSkgcmV0dXJuIHRydWVcbiAgICBpZiAodGhpcy5yZWV4cG9ydHMuaGFzKG5hbWUpKSByZXR1cm4gdHJ1ZVxuXG4gICAgLy8gZGVmYXVsdCBleHBvcnRzIG11c3QgYmUgZXhwbGljaXRseSByZS1leHBvcnRlZCAoIzMyOClcbiAgICBsZXQgZm91bmRJbm5lck1hcE5hbWUgPSBmYWxzZVxuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzLmZvckVhY2goKGRlcCkgPT4ge1xuICAgICAgICBpZiAoIWZvdW5kSW5uZXJNYXBOYW1lKSB7XG4gICAgICAgICAgbGV0IGlubmVyTWFwID0gZGVwKClcblxuICAgICAgICAgIC8vIHRvZG86IHJlcG9ydCBhcyB1bnJlc29sdmVkP1xuICAgICAgICAgIGlmIChpbm5lck1hcCAmJiBpbm5lck1hcC5oYXMobmFtZSkpIGZvdW5kSW5uZXJNYXBOYW1lID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBmb3VuZElubmVyTWFwTmFtZVxuICB9XG5cbiAgLyoqXG4gICAqIGVuc3VyZSB0aGF0IGltcG9ydGVkIG5hbWUgZnVsbHkgcmVzb2x2ZXMuXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gIG5hbWUgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGhhc0RlZXAobmFtZSkge1xuICAgIGlmICh0aGlzLm5hbWVzcGFjZS5oYXMobmFtZSkpIHJldHVybiB7IGZvdW5kOiB0cnVlLCBwYXRoOiBbdGhpc10gfVxuXG4gICAgaWYgKHRoaXMucmVleHBvcnRzLmhhcyhuYW1lKSkge1xuICAgICAgY29uc3QgeyBsb2NhbCwgZ2V0SW1wb3J0IH0gPSB0aGlzLnJlZXhwb3J0cy5nZXQobmFtZSlcbiAgICAgICAgICAsIGltcG9ydGVkID0gZ2V0SW1wb3J0KClcblxuICAgICAgLy8gaWYgaW1wb3J0IGlzIGlnbm9yZWQsIHJldHVybiBleHBsaWNpdCAnbnVsbCdcbiAgICAgIGlmIChpbXBvcnRlZCA9PSBudWxsKSByZXR1cm4geyBmb3VuZDogdHJ1ZSwgcGF0aDogW3RoaXNdIH1cblxuICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzLCBvbmx5IGlmIG5hbWUgbWF0Y2hlc1xuICAgICAgaWYgKGltcG9ydGVkLnBhdGggPT09IHRoaXMucGF0aCAmJiBsb2NhbCA9PT0gbmFtZSkgcmV0dXJuIHsgZm91bmQ6IGZhbHNlLCBwYXRoOiBbdGhpc10gfVxuXG4gICAgICBjb25zdCBkZWVwID0gaW1wb3J0ZWQuaGFzRGVlcChsb2NhbClcbiAgICAgIGRlZXAucGF0aC51bnNoaWZ0KHRoaXMpXG5cbiAgICAgIHJldHVybiBkZWVwXG4gICAgfVxuXG5cbiAgICAvLyBkZWZhdWx0IGV4cG9ydHMgbXVzdCBiZSBleHBsaWNpdGx5IHJlLWV4cG9ydGVkICgjMzI4KVxuICAgIGxldCByZXR1cm5WYWx1ZSA9IHsgZm91bmQ6IGZhbHNlLCBwYXRoOiBbdGhpc10gfVxuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzLmZvckVhY2goKGRlcCkgPT4ge1xuICAgICAgICBpZiAoIXJldHVyblZhbHVlLmZvdW5kKSB7XG4gICAgICAgICAgbGV0IGlubmVyTWFwID0gZGVwKClcbiAgICAgICAgICAvLyB0b2RvOiByZXBvcnQgYXMgdW5yZXNvbHZlZD9cbiAgICAgICAgICBpZiAoaW5uZXJNYXApIHtcblxuICAgICAgICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzXG4gICAgICAgICAgICBpZiAoaW5uZXJNYXAucGF0aCAhPT0gdGhpcy5wYXRoKSB7XG5cbiAgICAgICAgICAgICAgbGV0IGlubmVyVmFsdWUgPSBpbm5lck1hcC5oYXNEZWVwKG5hbWUpXG4gICAgICAgICAgICAgIGlmIChpbm5lclZhbHVlLmZvdW5kKSB7XG4gICAgICAgICAgICAgICAgaW5uZXJWYWx1ZS5wYXRoLnVuc2hpZnQodGhpcylcbiAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IGlubmVyVmFsdWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWVcbiAgfVxuXG4gIGdldChuYW1lKSB7XG4gICAgaWYgKHRoaXMubmFtZXNwYWNlLmhhcyhuYW1lKSkgcmV0dXJuIHRoaXMubmFtZXNwYWNlLmdldChuYW1lKVxuXG4gICAgaWYgKHRoaXMucmVleHBvcnRzLmhhcyhuYW1lKSkge1xuICAgICAgY29uc3QgeyBsb2NhbCwgZ2V0SW1wb3J0IH0gPSB0aGlzLnJlZXhwb3J0cy5nZXQobmFtZSlcbiAgICAgICAgICAsIGltcG9ydGVkID0gZ2V0SW1wb3J0KClcblxuICAgICAgLy8gaWYgaW1wb3J0IGlzIGlnbm9yZWQsIHJldHVybiBleHBsaWNpdCAnbnVsbCdcbiAgICAgIGlmIChpbXBvcnRlZCA9PSBudWxsKSByZXR1cm4gbnVsbFxuXG4gICAgICAvLyBzYWZlZ3VhcmQgYWdhaW5zdCBjeWNsZXMsIG9ubHkgaWYgbmFtZSBtYXRjaGVzXG4gICAgICBpZiAoaW1wb3J0ZWQucGF0aCA9PT0gdGhpcy5wYXRoICYmIGxvY2FsID09PSBuYW1lKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgIHJldHVybiBpbXBvcnRlZC5nZXQobG9jYWwpXG4gICAgfVxuXG4gICAgLy8gZGVmYXVsdCBleHBvcnRzIG11c3QgYmUgZXhwbGljaXRseSByZS1leHBvcnRlZCAoIzMyOClcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSB1bmRlZmluZWRcbiAgICBpZiAobmFtZSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICB0aGlzLmRlcGVuZGVuY2llcy5mb3JFYWNoKChkZXApID0+IHtcbiAgICAgICAgaWYgKHJldHVyblZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBsZXQgaW5uZXJNYXAgPSBkZXAoKVxuICAgICAgICAgIC8vIHRvZG86IHJlcG9ydCBhcyB1bnJlc29sdmVkP1xuICAgICAgICAgIGlmIChpbm5lck1hcCkge1xuXG4gICAgICAgICAgICAvLyBzYWZlZ3VhcmQgYWdhaW5zdCBjeWNsZXNcbiAgICAgICAgICAgIGlmIChpbm5lck1hcC5wYXRoICE9PSB0aGlzLnBhdGgpIHtcblxuICAgICAgICAgICAgICBsZXQgaW5uZXJWYWx1ZSA9IGlubmVyTWFwLmdldChuYW1lKVxuICAgICAgICAgICAgICBpZiAoaW5uZXJWYWx1ZSAhPT0gdW5kZWZpbmVkKSByZXR1cm5WYWx1ZSA9IGlubmVyVmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlXG4gIH1cblxuICBmb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdGhpcy5uYW1lc3BhY2UuZm9yRWFjaCgodiwgbikgPT5cbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdiwgbiwgdGhpcykpXG5cbiAgICB0aGlzLnJlZXhwb3J0cy5mb3JFYWNoKCh7IGdldEltcG9ydCwgbG9jYWwgfSwgbmFtZSkgPT4ge1xuICAgICAgY29uc3QgcmVleHBvcnRlZCA9IGdldEltcG9ydCgpXG4gICAgICAvLyBjYW4ndCBsb29rIHVwIG1ldGEgZm9yIGlnbm9yZWQgcmUtZXhwb3J0cyAoIzM0OClcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgcmVleHBvcnRlZCAmJiByZWV4cG9ydGVkLmdldChsb2NhbCksIG5hbWUsIHRoaXMpXG4gICAgfSlcblxuICAgIHRoaXMuZGVwZW5kZW5jaWVzLmZvckVhY2goZGVwID0+IGRlcCgpLmZvckVhY2goKHYsIG4pID0+XG4gICAgICBuICE9PSAnZGVmYXVsdCcgJiYgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2LCBuLCB0aGlzKSkpXG4gIH1cblxuICAvLyB0b2RvOiBrZXlzLCB2YWx1ZXMsIGVudHJpZXM/XG5cbiAgcmVwb3J0RXJyb3JzKGNvbnRleHQsIGRlY2xhcmF0aW9uKSB7XG4gICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgbm9kZTogZGVjbGFyYXRpb24uc291cmNlLFxuICAgICAgbWVzc2FnZTogYFBhcnNlIGVycm9ycyBpbiBpbXBvcnRlZCBtb2R1bGUgJyR7ZGVjbGFyYXRpb24uc291cmNlLnZhbHVlfSc6IGAgK1xuICAgICAgICAgICAgICAgICAgYCR7dGhpcy5lcnJvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZSA9PiBgJHtlLm1lc3NhZ2V9ICgke2UubGluZU51bWJlcn06JHtlLmNvbHVtbn0pYClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKCcsICcpfWAsXG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIHBhcnNlIGRvY3MgZnJvbSB0aGUgZmlyc3Qgbm9kZSB0aGF0IGhhcyBsZWFkaW5nIGNvbW1lbnRzXG4gKiBAcGFyYW0gIHsuLi5bdHlwZV19IG5vZGVzIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3tkb2M6IG9iamVjdH19XG4gKi9cbmZ1bmN0aW9uIGNhcHR1cmVEb2MoZG9jU3R5bGVQYXJzZXJzLCAuLi5ub2Rlcykge1xuICBjb25zdCBtZXRhZGF0YSA9IHt9XG5cbiAgLy8gJ3NvbWUnIHNob3J0LWNpcmN1aXRzIG9uIGZpcnN0ICd0cnVlJ1xuICBub2Rlcy5zb21lKG4gPT4ge1xuICAgIGlmICghbi5sZWFkaW5nQ29tbWVudHMpIHJldHVybiBmYWxzZVxuXG4gICAgZm9yIChsZXQgbmFtZSBpbiBkb2NTdHlsZVBhcnNlcnMpIHtcbiAgICAgIGNvbnN0IGRvYyA9IGRvY1N0eWxlUGFyc2Vyc1tuYW1lXShuLmxlYWRpbmdDb21tZW50cylcbiAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgbWV0YWRhdGEuZG9jID0gZG9jXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfSlcblxuICByZXR1cm4gbWV0YWRhdGFcbn1cblxuY29uc3QgYXZhaWxhYmxlRG9jU3R5bGVQYXJzZXJzID0ge1xuICBqc2RvYzogY2FwdHVyZUpzRG9jLFxuICB0b21kb2M6IGNhcHR1cmVUb21Eb2MsXG59XG5cbi8qKlxuICogcGFyc2UgSlNEb2MgZnJvbSBsZWFkaW5nIGNvbW1lbnRzXG4gKiBAcGFyYW0gIHsuLi5bdHlwZV19IGNvbW1lbnRzIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3tkb2M6IG9iamVjdH19XG4gKi9cbmZ1bmN0aW9uIGNhcHR1cmVKc0RvYyhjb21tZW50cykge1xuICBsZXQgZG9jXG5cbiAgLy8gY2FwdHVyZSBYU0RvY1xuICBjb21tZW50cy5mb3JFYWNoKGNvbW1lbnQgPT4ge1xuICAgIC8vIHNraXAgbm9uLWJsb2NrIGNvbW1lbnRzXG4gICAgaWYgKGNvbW1lbnQudmFsdWUuc2xpY2UoMCwgNCkgIT09ICcqXFxuIConKSByZXR1cm5cbiAgICB0cnkge1xuICAgICAgZG9jID0gZG9jdHJpbmUucGFyc2UoY29tbWVudC52YWx1ZSwgeyB1bndyYXA6IHRydWUgfSlcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8qIGRvbid0IGNhcmUsIGZvciBub3c/IG1heWJlIGFkZCB0byBgZXJyb3JzP2AgKi9cbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGRvY1xufVxuXG4vKipcbiAgKiBwYXJzZSBUb21Eb2Mgc2VjdGlvbiBmcm9tIGNvbW1lbnRzXG4gICovXG5mdW5jdGlvbiBjYXB0dXJlVG9tRG9jKGNvbW1lbnRzKSB7XG4gIC8vIGNvbGxlY3QgbGluZXMgdXAgdG8gZmlyc3QgcGFyYWdyYXBoIGJyZWFrXG4gIGNvbnN0IGxpbmVzID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21tZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNvbW1lbnQgPSBjb21tZW50c1tpXVxuICAgIGlmIChjb21tZW50LnZhbHVlLm1hdGNoKC9eXFxzKiQvKSkgYnJlYWtcbiAgICBsaW5lcy5wdXNoKGNvbW1lbnQudmFsdWUudHJpbSgpKVxuICB9XG5cbiAgLy8gcmV0dXJuIGRvY3RyaW5lLWxpa2Ugb2JqZWN0XG4gIGNvbnN0IHN0YXR1c01hdGNoID0gbGluZXMuam9pbignICcpLm1hdGNoKC9eKFB1YmxpY3xJbnRlcm5hbHxEZXByZWNhdGVkKTpcXHMqKC4rKS8pXG4gIGlmIChzdGF0dXNNYXRjaCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNjcmlwdGlvbjogc3RhdHVzTWF0Y2hbMl0sXG4gICAgICB0YWdzOiBbe1xuICAgICAgICB0aXRsZTogc3RhdHVzTWF0Y2hbMV0udG9Mb3dlckNhc2UoKSxcbiAgICAgICAgZGVzY3JpcHRpb246IHN0YXR1c01hdGNoWzJdLFxuICAgICAgfV0sXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVHJhdmVyc2UgYSBwYXR0ZXJuL2lkZW50aWZpZXIgbm9kZSwgY2FsbGluZyAnY2FsbGJhY2snXG4gKiBmb3IgZWFjaCBsZWFmIGlkZW50aWZpZXIuXG4gKiBAcGFyYW0gIHtub2RlfSAgIHBhdHRlcm5cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKHBhdHRlcm4sIGNhbGxiYWNrKSB7XG4gIHN3aXRjaCAocGF0dGVybi50eXBlKSB7XG4gICAgY2FzZSAnSWRlbnRpZmllcic6IC8vIGJhc2UgY2FzZVxuICAgICAgY2FsbGJhY2socGF0dGVybilcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlICdPYmplY3RQYXR0ZXJuJzpcbiAgICAgIHBhdHRlcm4ucHJvcGVydGllcy5mb3JFYWNoKCh7IHZhbHVlIH0pID0+IHtcbiAgICAgICAgcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUodmFsdWUsIGNhbGxiYWNrKVxuICAgICAgfSlcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlICdBcnJheVBhdHRlcm4nOlxuICAgICAgcGF0dGVybi5lbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50ID09IG51bGwpIHJldHVyblxuICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShlbGVtZW50LCBjYWxsYmFjaylcbiAgICAgIH0pXG4gICAgICBicmVha1xuICB9XG59XG4iXX0=