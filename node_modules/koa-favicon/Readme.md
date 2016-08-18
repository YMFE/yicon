# koa-favicon [![Build Status](https://travis-ci.org/koajs/favicon.svg)](https://travis-ci.org/koajs/favicon)

 Koa middleware for serving a favicon. Based on [serve-favicon](https://github.com/expressjs/serve-favicon).

## Installation

```js
$ npm install koa-favicon
```

## Example

```js
var koa = require('koa');
var favicon = require('koa-favicon');
var app = koa();

app.use(favicon(__dirname + '/public/favicon.ico'));
```

## API

### favicon(path, [options])

Returns a middleware serving the favicon found on the given `path`.

#### options

- `maxAge` cache-control max-age directive in ms, defaulting to 1 day.

## License

  MIT
