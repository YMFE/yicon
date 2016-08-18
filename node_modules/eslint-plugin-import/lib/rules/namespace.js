'use strict';

var _es6Map = require('es6-map');

var _es6Map2 = _interopRequireDefault(_es6Map);

var _getExports = require('../core/getExports');

var _getExports2 = _interopRequireDefault(_getExports);

var _importDeclaration = require('../importDeclaration');

var _importDeclaration2 = _interopRequireDefault(_importDeclaration);

var _declaredScope = require('../core/declaredScope');

var _declaredScope2 = _interopRequireDefault(_declaredScope);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.meta = {
  schema: [{
    'type': 'object',
    'properties': {
      'allowComputed': {
        'description': 'If `false`, will report computed (and thus, un-lintable) references ' + 'to namespace members.',
        'type': 'boolean',
        'default': false
      }
    },
    'additionalProperties': false
  }]
};

exports.create = function namespaceRule(context) {

  // read options
  var _ref = context.options[0] || {};

  var _ref$allowComputed = _ref.allowComputed;
  var allowComputed = _ref$allowComputed === undefined ? false : _ref$allowComputed;


  var namespaces = new _es6Map2.default();

  function makeMessage(last, namepath) {
    return '\'' + last.name + '\' not found in' + (namepath.length > 1 ? ' deeply ' : ' ') + ('imported namespace \'' + namepath.join('.') + '\'.');
  }

  return {

    // pick up all imports at body entry time, to properly respect hoisting
    'Program': function Program(_ref2) {
      var body = _ref2.body;

      function processBodyStatement(declaration) {
        if (declaration.type !== 'ImportDeclaration') return;

        if (declaration.specifiers.length === 0) return;

        var imports = _getExports2.default.get(declaration.source.value, context);
        if (imports == null) return null;

        if (imports.errors.length) {
          imports.reportErrors(context, declaration);
          return;
        }

        declaration.specifiers.forEach(function (specifier) {
          switch (specifier.type) {
            case 'ImportNamespaceSpecifier':
              if (!imports.size) {
                context.report(specifier, 'No exported names found in module \'' + declaration.source.value + '\'.');
              }
              namespaces.set(specifier.local.name, imports);
              break;
            case 'ImportDefaultSpecifier':
            case 'ImportSpecifier':
              {
                var meta = imports.get(
                // default to 'default' for default http://i.imgur.com/nj6qAWy.jpg
                specifier.imported ? specifier.imported.name : 'default');
                if (!meta || !meta.namespace) break;
                namespaces.set(specifier.local.name, meta.namespace);
                break;
              }
          }
        });
      }
      body.forEach(processBodyStatement);
    },

    // same as above, but does not add names to local map
    'ExportNamespaceSpecifier': function ExportNamespaceSpecifier(namespace) {
      var declaration = (0, _importDeclaration2.default)(context);

      var imports = _getExports2.default.get(declaration.source.value, context);
      if (imports == null) return null;

      if (imports.errors.length) {
        imports.reportErrors(context, declaration);
        return;
      }

      if (!imports.size) {
        context.report(namespace, 'No exported names found in module \'' + declaration.source.value + '\'.');
      }
    },

    // todo: check for possible redefinition

    'MemberExpression': function MemberExpression(dereference) {
      if (dereference.object.type !== 'Identifier') return;
      if (!namespaces.has(dereference.object.name)) return;

      if (dereference.parent.type === 'AssignmentExpression' && dereference.parent.left === dereference) {
        context.report(dereference.parent, 'Assignment to member of namespace \'' + dereference.object.name + '\'.');
      }

      // go deep
      var namespace = namespaces.get(dereference.object.name);
      var namepath = [dereference.object.name];
      // while property is namespace and parent is member expression, keep validating
      while (namespace instanceof _getExports2.default && dereference.type === 'MemberExpression') {

        if (dereference.computed) {
          if (!allowComputed) {
            context.report(dereference.property, 'Unable to validate computed reference to imported namespace \'' + dereference.object.name + '\'.');
          }
          return;
        }

        if (!namespace.has(dereference.property.name)) {
          context.report(dereference.property, makeMessage(dereference.property, namepath));
          break;
        }

        // stash and pop
        namepath.push(dereference.property.name);
        namespace = namespace.get(dereference.property.name).namespace;
        dereference = dereference.parent;
      }
    },

    'VariableDeclarator': function VariableDeclarator(_ref3) {
      var id = _ref3.id;
      var init = _ref3.init;

      if (init == null) return;
      if (init.type !== 'Identifier') return;
      if (!namespaces.has(init.name)) return;

      // check for redefinition in intermediate scopes
      if ((0, _declaredScope2.default)(context, init.name) !== 'module') return;

      // DFS traverse child namespaces
      function testKey(pattern, namespace) {
        var path = arguments.length <= 2 || arguments[2] === undefined ? [init.name] : arguments[2];

        if (!(namespace instanceof _getExports2.default)) return;

        if (pattern.type !== 'ObjectPattern') return;

        pattern.properties.forEach(function (property) {
          if (property.key.type !== 'Identifier') {
            context.report({
              node: property,
              message: 'Only destructure top-level names.'
            });
          } else if (!namespace.has(property.key.name)) {
            context.report({
              node: property,
              message: makeMessage(property.key, path)
            });
          } else {
            path.push(property.key.name);
            testKey(property.value, namespace.get(property.key.name).namespace, path);
            path.pop();
          }
        });
      }

      testKey(id, namespaces.get(init.name));
    }
  };
};
//# sourceMappingURL=data:application/json;base64,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S0E7QUFDTCxpQkFBSyxJQUFMLENBQVUsU0FBUyxHQUFULENBQWEsSUFBdkI7QUFDQSxvQkFBUSxTQUFTLEtBQWpCLEVBQXdCLFVBQVUsR0FBVixDQUFjLFNBQVMsR0FBVCxDQUFhLElBQTNCLEVBQWlDLFNBQXpELEVBQW9FLElBQXBFO0FBQ0EsaUJBQUssR0FBTDtBQUNEO0FBQ0YsU0FoQkQ7QUFpQkQ7O0FBRUQsY0FBUSxFQUFSLEVBQVksV0FBVyxHQUFYLENBQWUsS0FBSyxJQUFwQixDQUFaO0FBQ0Q7QUF4SUksR0FBUDtBQTBJRCxDQXpKRCIsImZpbGUiOiJydWxlcy9uYW1lc3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWFwIGZyb20gJ2VzNi1tYXAnXG5cbmltcG9ydCBFeHBvcnRzIGZyb20gJy4uL2NvcmUvZ2V0RXhwb3J0cydcbmltcG9ydCBpbXBvcnREZWNsYXJhdGlvbiBmcm9tICcuLi9pbXBvcnREZWNsYXJhdGlvbidcbmltcG9ydCBkZWNsYXJlZFNjb3BlIGZyb20gJy4uL2NvcmUvZGVjbGFyZWRTY29wZSdcblxuZXhwb3J0cy5tZXRhID0ge1xuICBzY2hlbWE6IFtcbiAgICB7XG4gICAgICAndHlwZSc6ICdvYmplY3QnLFxuICAgICAgJ3Byb3BlcnRpZXMnOiB7XG4gICAgICAgICdhbGxvd0NvbXB1dGVkJzoge1xuICAgICAgICAgICdkZXNjcmlwdGlvbic6XG4gICAgICAgICAgICAnSWYgYGZhbHNlYCwgd2lsbCByZXBvcnQgY29tcHV0ZWQgKGFuZCB0aHVzLCB1bi1saW50YWJsZSkgcmVmZXJlbmNlcyAnICtcbiAgICAgICAgICAgICd0byBuYW1lc3BhY2UgbWVtYmVycy4nLFxuICAgICAgICAgICd0eXBlJzogJ2Jvb2xlYW4nLFxuICAgICAgICAgICdkZWZhdWx0JzogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJzogZmFsc2UsXG4gICAgfSxcbiAgXSxcbn1cblxuZXhwb3J0cy5jcmVhdGUgPSBmdW5jdGlvbiBuYW1lc3BhY2VSdWxlKGNvbnRleHQpIHtcblxuICAvLyByZWFkIG9wdGlvbnNcbiAgY29uc3Qge1xuICAgIGFsbG93Q29tcHV0ZWQgPSBmYWxzZSxcbiAgfSA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fVxuXG4gIGNvbnN0IG5hbWVzcGFjZXMgPSBuZXcgTWFwKClcblxuICBmdW5jdGlvbiBtYWtlTWVzc2FnZShsYXN0LCBuYW1lcGF0aCkge1xuICAgICByZXR1cm4gYCcke2xhc3QubmFtZX0nIG5vdCBmb3VuZCBpbmAgK1xuICAgICAgICAgICAgKG5hbWVwYXRoLmxlbmd0aCA+IDEgPyAnIGRlZXBseSAnIDogJyAnKSArXG4gICAgICAgICAgICBgaW1wb3J0ZWQgbmFtZXNwYWNlICcke25hbWVwYXRoLmpvaW4oJy4nKX0nLmBcbiAgfVxuXG4gIHJldHVybiB7XG5cbiAgICAvLyBwaWNrIHVwIGFsbCBpbXBvcnRzIGF0IGJvZHkgZW50cnkgdGltZSwgdG8gcHJvcGVybHkgcmVzcGVjdCBob2lzdGluZ1xuICAgICdQcm9ncmFtJzogZnVuY3Rpb24gKHsgYm9keSB9KSB7XG4gICAgICBmdW5jdGlvbiBwcm9jZXNzQm9keVN0YXRlbWVudChkZWNsYXJhdGlvbikge1xuICAgICAgICBpZiAoZGVjbGFyYXRpb24udHlwZSAhPT0gJ0ltcG9ydERlY2xhcmF0aW9uJykgcmV0dXJuXG5cbiAgICAgICAgaWYgKGRlY2xhcmF0aW9uLnNwZWNpZmllcnMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAgICAgICBjb25zdCBpbXBvcnRzID0gRXhwb3J0cy5nZXQoZGVjbGFyYXRpb24uc291cmNlLnZhbHVlLCBjb250ZXh0KVxuICAgICAgICBpZiAoaW1wb3J0cyA9PSBudWxsKSByZXR1cm4gbnVsbFxuXG4gICAgICAgIGlmIChpbXBvcnRzLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBpbXBvcnRzLnJlcG9ydEVycm9ycyhjb250ZXh0LCBkZWNsYXJhdGlvbilcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGRlY2xhcmF0aW9uLnNwZWNpZmllcnMuZm9yRWFjaCgoc3BlY2lmaWVyKSA9PiB7XG4gICAgICAgICAgc3dpdGNoIChzcGVjaWZpZXIudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyJzpcbiAgICAgICAgICAgICAgaWYgKCFpbXBvcnRzLnNpemUpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydChzcGVjaWZpZXIsXG4gICAgICAgICAgICAgICAgICBgTm8gZXhwb3J0ZWQgbmFtZXMgZm91bmQgaW4gbW9kdWxlICcke2RlY2xhcmF0aW9uLnNvdXJjZS52YWx1ZX0nLmApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbmFtZXNwYWNlcy5zZXQoc3BlY2lmaWVyLmxvY2FsLm5hbWUsIGltcG9ydHMpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJzpcbiAgICAgICAgICAgIGNhc2UgJ0ltcG9ydFNwZWNpZmllcic6IHtcbiAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IGltcG9ydHMuZ2V0KFxuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gJ2RlZmF1bHQnIGZvciBkZWZhdWx0IGh0dHA6Ly9pLmltZ3VyLmNvbS9uajZxQVd5LmpwZ1xuICAgICAgICAgICAgICAgIHNwZWNpZmllci5pbXBvcnRlZCA/IHNwZWNpZmllci5pbXBvcnRlZC5uYW1lIDogJ2RlZmF1bHQnKVxuICAgICAgICAgICAgICBpZiAoIW1ldGEgfHwgIW1ldGEubmFtZXNwYWNlKSBicmVha1xuICAgICAgICAgICAgICBuYW1lc3BhY2VzLnNldChzcGVjaWZpZXIubG9jYWwubmFtZSwgbWV0YS5uYW1lc3BhY2UpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgYm9keS5mb3JFYWNoKHByb2Nlc3NCb2R5U3RhdGVtZW50KVxuICAgIH0sXG5cbiAgICAvLyBzYW1lIGFzIGFib3ZlLCBidXQgZG9lcyBub3QgYWRkIG5hbWVzIHRvIGxvY2FsIG1hcFxuICAgICdFeHBvcnROYW1lc3BhY2VTcGVjaWZpZXInOiBmdW5jdGlvbiAobmFtZXNwYWNlKSB7XG4gICAgICB2YXIgZGVjbGFyYXRpb24gPSBpbXBvcnREZWNsYXJhdGlvbihjb250ZXh0KVxuXG4gICAgICB2YXIgaW1wb3J0cyA9IEV4cG9ydHMuZ2V0KGRlY2xhcmF0aW9uLnNvdXJjZS52YWx1ZSwgY29udGV4dClcbiAgICAgIGlmIChpbXBvcnRzID09IG51bGwpIHJldHVybiBudWxsXG5cbiAgICAgIGlmIChpbXBvcnRzLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgaW1wb3J0cy5yZXBvcnRFcnJvcnMoY29udGV4dCwgZGVjbGFyYXRpb24pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoIWltcG9ydHMuc2l6ZSkge1xuICAgICAgICBjb250ZXh0LnJlcG9ydChuYW1lc3BhY2UsXG4gICAgICAgICAgYE5vIGV4cG9ydGVkIG5hbWVzIGZvdW5kIGluIG1vZHVsZSAnJHtkZWNsYXJhdGlvbi5zb3VyY2UudmFsdWV9Jy5gKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB0b2RvOiBjaGVjayBmb3IgcG9zc2libGUgcmVkZWZpbml0aW9uXG5cbiAgICAnTWVtYmVyRXhwcmVzc2lvbic6IGZ1bmN0aW9uIChkZXJlZmVyZW5jZSkge1xuICAgICAgaWYgKGRlcmVmZXJlbmNlLm9iamVjdC50eXBlICE9PSAnSWRlbnRpZmllcicpIHJldHVyblxuICAgICAgaWYgKCFuYW1lc3BhY2VzLmhhcyhkZXJlZmVyZW5jZS5vYmplY3QubmFtZSkpIHJldHVyblxuXG4gICAgICBpZiAoZGVyZWZlcmVuY2UucGFyZW50LnR5cGUgPT09ICdBc3NpZ25tZW50RXhwcmVzc2lvbicgJiZcbiAgICAgICAgICBkZXJlZmVyZW5jZS5wYXJlbnQubGVmdCA9PT0gZGVyZWZlcmVuY2UpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChkZXJlZmVyZW5jZS5wYXJlbnQsXG4gICAgICAgICAgICAgIGBBc3NpZ25tZW50IHRvIG1lbWJlciBvZiBuYW1lc3BhY2UgJyR7ZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWV9Jy5gKVxuICAgICAgfVxuXG4gICAgICAvLyBnbyBkZWVwXG4gICAgICB2YXIgbmFtZXNwYWNlID0gbmFtZXNwYWNlcy5nZXQoZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWUpXG4gICAgICB2YXIgbmFtZXBhdGggPSBbZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWVdXG4gICAgICAvLyB3aGlsZSBwcm9wZXJ0eSBpcyBuYW1lc3BhY2UgYW5kIHBhcmVudCBpcyBtZW1iZXIgZXhwcmVzc2lvbiwga2VlcCB2YWxpZGF0aW5nXG4gICAgICB3aGlsZSAobmFtZXNwYWNlIGluc3RhbmNlb2YgRXhwb3J0cyAmJlxuICAgICAgICAgICAgIGRlcmVmZXJlbmNlLnR5cGUgPT09ICdNZW1iZXJFeHByZXNzaW9uJykge1xuXG4gICAgICAgIGlmIChkZXJlZmVyZW5jZS5jb21wdXRlZCkge1xuICAgICAgICAgIGlmICghYWxsb3dDb21wdXRlZCkge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoZGVyZWZlcmVuY2UucHJvcGVydHksXG4gICAgICAgICAgICAgICdVbmFibGUgdG8gdmFsaWRhdGUgY29tcHV0ZWQgcmVmZXJlbmNlIHRvIGltcG9ydGVkIG5hbWVzcGFjZSBcXCcnICtcbiAgICAgICAgICAgICAgZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWUgKyAnXFwnLicpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFuYW1lc3BhY2UuaGFzKGRlcmVmZXJlbmNlLnByb3BlcnR5Lm5hbWUpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgICBkZXJlZmVyZW5jZS5wcm9wZXJ0eSxcbiAgICAgICAgICAgIG1ha2VNZXNzYWdlKGRlcmVmZXJlbmNlLnByb3BlcnR5LCBuYW1lcGF0aCkpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN0YXNoIGFuZCBwb3BcbiAgICAgICAgbmFtZXBhdGgucHVzaChkZXJlZmVyZW5jZS5wcm9wZXJ0eS5uYW1lKVxuICAgICAgICBuYW1lc3BhY2UgPSBuYW1lc3BhY2UuZ2V0KGRlcmVmZXJlbmNlLnByb3BlcnR5Lm5hbWUpLm5hbWVzcGFjZVxuICAgICAgICBkZXJlZmVyZW5jZSA9IGRlcmVmZXJlbmNlLnBhcmVudFxuICAgICAgfVxuXG4gICAgfSxcblxuICAgICdWYXJpYWJsZURlY2xhcmF0b3InOiBmdW5jdGlvbiAoeyBpZCwgaW5pdCB9KSB7XG4gICAgICBpZiAoaW5pdCA9PSBudWxsKSByZXR1cm5cbiAgICAgIGlmIChpbml0LnR5cGUgIT09ICdJZGVudGlmaWVyJykgcmV0dXJuXG4gICAgICBpZiAoIW5hbWVzcGFjZXMuaGFzKGluaXQubmFtZSkpIHJldHVyblxuXG4gICAgICAvLyBjaGVjayBmb3IgcmVkZWZpbml0aW9uIGluIGludGVybWVkaWF0ZSBzY29wZXNcbiAgICAgIGlmIChkZWNsYXJlZFNjb3BlKGNvbnRleHQsIGluaXQubmFtZSkgIT09ICdtb2R1bGUnKSByZXR1cm5cblxuICAgICAgLy8gREZTIHRyYXZlcnNlIGNoaWxkIG5hbWVzcGFjZXNcbiAgICAgIGZ1bmN0aW9uIHRlc3RLZXkocGF0dGVybiwgbmFtZXNwYWNlLCBwYXRoID0gW2luaXQubmFtZV0pIHtcbiAgICAgICAgaWYgKCEobmFtZXNwYWNlIGluc3RhbmNlb2YgRXhwb3J0cykpIHJldHVyblxuXG4gICAgICAgIGlmIChwYXR0ZXJuLnR5cGUgIT09ICdPYmplY3RQYXR0ZXJuJykgcmV0dXJuXG5cbiAgICAgICAgcGF0dGVybi5wcm9wZXJ0aWVzLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgaWYgKHByb3BlcnR5LmtleS50eXBlICE9PSAnSWRlbnRpZmllcicpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgbm9kZTogcHJvcGVydHksXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdPbmx5IGRlc3RydWN0dXJlIHRvcC1sZXZlbCBuYW1lcy4nLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2UgaWYgKCFuYW1lc3BhY2UuaGFzKHByb3BlcnR5LmtleS5uYW1lKSkge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICBub2RlOiBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogbWFrZU1lc3NhZ2UocHJvcGVydHkua2V5LCBwYXRoKSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChwcm9wZXJ0eS5rZXkubmFtZSlcbiAgICAgICAgICAgIHRlc3RLZXkocHJvcGVydHkudmFsdWUsIG5hbWVzcGFjZS5nZXQocHJvcGVydHkua2V5Lm5hbWUpLm5hbWVzcGFjZSwgcGF0aClcbiAgICAgICAgICAgIHBhdGgucG9wKClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRlc3RLZXkoaWQsIG5hbWVzcGFjZXMuZ2V0KGluaXQubmFtZSkpXG4gICAgfSxcbiAgfVxufVxuIl19