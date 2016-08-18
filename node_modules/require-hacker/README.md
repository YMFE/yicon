# require-hacker

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

<!---
[![Gratipay][gratipay-image]][gratipay-url]
-->

Is a small helper module providing tools for instrumenting Node.js `require()` calls.

## Topics

- [What it does and why is it needed?](#what-it-does-and-why-is-it-needed)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API](#api)
- [Gotchas](#gotchas)
- [References](#references)
- [Contributing](#contributing)

## What it does and why is it needed?

Standard Node.js `require()` calls simply loaded javascript files from disk and evaluated them.

Some time after various hackers hacked the [Module module](https://github.com/nodejs/node/blob/master/lib/module.js) and various solutions emerged such as `coffee-script/register` and `babel-core/register` allowing everyone to `require()` code written in any language out there (coffeescript and ES7 in case of the aforementioned "require hooks").

This module provides a tool to perform such tricks along with a possibility to also intercept `require()` calls not just for specific file extensions but for an arbitrary abstract path. Consider, for example, `require("http://thor.onion/module?user=123")` or `require("春秋左傳·僖公二十二年")`, whatever. Who might need this? You never know.

## Installation

```bash
$ npm install require-hacker --save
```

## Usage

Something basic

```javascript
import require_hacker from 'require-hacker'
import fs from 'fs'

// mount require() hook
const hook = require_hacker.hook('txt', path =>
{
  return `module.exports = "${fs.readFileSync(path).replace(/"/g, '\"')}"`
})

// will output text file contents
console.log(require('./test.txt'))

// unmount require() hook
hook.unmount()

// will throw "SyntaxError: Unexpected token ILLEGAL"
require('./test without hook.txt')
```

Something unusual

```javascript
const hook = require_hacker.global_hook('network', path =>
{
  if (!path.starts_with('http://xhamster.com'))
  {
    return
  }

  // returns javascript module source code, something like:
  //
  // "module.exports =
  //  {
  //    category   : 'redhead',
  //    videos     : [12345, 12346, 12347],
  //    unsubscribe: function()
  //    {
  //      http.post('http://xhamster.com/unsubscribe', { user: 123 })
  //    }
  //  }"
  //
  return synchronous_http.get(path)
})

const readheads = require('http://xhamster.com/category/redhead')
readheads.unsubscribe()
```

Or

```javascript
const hook = require_hacker.global_hook('database', path =>
{
  if (!path.starts_with('postgresql://'))
  {
    return
  }

  // returns javascript module source code, something like:
  //
  // "module.exports =
  //  {
  //    words: ['a', 'b', 'c']
  //    sum: function()
  //    {
  //      return words.join('')
  //    }
  //  }"
  //
  const schema = path.substring(0, 'postgresql://'.length)
  return pg.sql(`select * from ${schema}.generate_javascript()`)
})

const summator = require('postgresql://summator')
console.log(summator.sum())
```

And don't ask me what for.

## Configuration

To see debug logs in the console one can use this code

```javascript
require_hacker.log.options.debug = true
```

## API

#### .hook(file_extension, resolve)

Will intercept all `require()` calls for paths with this `file_extension` and reroute them to the `resolve` function. The `require()`d path must exist in the filesystem, otherwise an exception will be thrown: `Cannot find module`.

Returns an object with `.unmount()` method which unmounts this `require()` hook from the system.

The `resolve` function takes two parameters:

  * the `path` which is `require()`d
  * the `module` in which the `require()` call was originated (this `module` parameter can be used for `require_hacker.resolve(path, module)` function call)

The `resolve` function must return either a valid CommonJS javascript module source code or it can simply `return` nothing and in that case it will skip this hook.

#### .global_hook(meaningful_id, resolve, [options])

Can intercept all `require()` calls. The behaviour is controlled by `precede_node_loader` option:

  * when it's `true` (default) it will intercept all `require()` calls before they are passed to the original Node.js `require()` loader
  * when it's `false` it will intercept only those `require()` calls which failed to be resolved by the original Node.js `require()` loader

Returns an object with `.unmount()` method which unmounts this `require()` hook from the system.

The `resolve` function takes two parameters:

  * the `path` which is `require()`d.
  * the `module` in which the `require()` call was originated (this `module` parameter can be used for `require_hacker.resolve(path, module)` function call)

The `resolve` function must either return a valid CommonJS javascript module source code or it can simply `return` nothing and in that case it will skip this hook.

#### .resolver(resolve)

Can intercept all `require()` calls and return a custom `require()`d path if needed (this process is called "resolving").

Returns an object with `.unmount()` method which unmounts this `require()` hook from the system.

The `resolve` function takes two parameters:

  * the `path` which is `require()`d.
  * the `module` in which the `require()` call was originated (this `module` parameter can be used for `require_hacker.resolve(path, module)` function call)

The `resolve` function must either return a real filesystem path to a javascript (or json) file or it can simply `return` nothing and in that case it will take no effect.

#### .to_javascript_module_source(anything)

Converts anyting (an undefined, a string, a JSON object, a function, a regular expression - anything) to a valid CommonJS javascript module source code.

#### .resolve(path, module)

Resolves a requireable `path` to a real filesystem path to a javascript (or json) file. Resolution is performed relative to the `module` (javascript file) passed as the second parameter (resolves `npm link`, global `node_modules`, etc). It's just an alias to the native Node.js path resolution function. Will throw `Error: Cannot find module '...'` if the `path` isn't resolved to an existing javascript (or json) file.

## Gotchas

None whatsoever

## References

There are various articles on this sort of `require()` hook trickery on the internets.

[How require() actually works](http://thenodeway.io/posts/how-require-actually-works/)

[Hooking into Node loader for fun and profit](http://glebbahmutov.com/blog/hooking-into-node-loader-for-fun-and-profit/)

## Contributing

After cloning this repo, ensure dependencies are installed by running:

```sh
npm install
```

This module is written in ES6 and uses [Babel](http://babeljs.io/) for ES5
transpilation. Widely consumable JavaScript can be produced by running:

```sh
npm run build
```

Once `npm run build` has run, you may `import` or `require()` directly from
node.

After developing, the full test suite can be evaluated by running:

```sh
npm test
```

While actively developing, one can use (personally I don't use it)

```sh
npm run watch
```

in a terminal. This will watch the file system and run tests automatically 
whenever you save a js file.

When you're ready to test your new functionality on a real project, you can run

```sh
npm pack
```

It will `build`, `test` and then create a `.tgz` archive which you can then install in your project folder

```sh
npm install [module name with version].tar.gz
```

## License

[MIT](LICENSE)
[npm-image]: https://img.shields.io/npm/v/require-hacker.svg
[npm-url]: https://npmjs.org/package/require-hacker
[travis-image]: https://img.shields.io/travis/halt-hammerzeit/require-hacker/master.svg
[travis-url]: https://travis-ci.org/halt-hammerzeit/require-hacker
[downloads-image]: https://img.shields.io/npm/dm/require-hacker.svg
[downloads-url]: https://npmjs.org/package/require-hacker
[coveralls-image]: https://img.shields.io/coveralls/halt-hammerzeit/require-hacker/master.svg
[coveralls-url]: https://coveralls.io/r/halt-hammerzeit/require-hacker?branch=master

<!---
[gratipay-image]: https://img.shields.io/gratipay/dougwilson.svg
[gratipay-url]: https://gratipay.com/dougwilson/
-->