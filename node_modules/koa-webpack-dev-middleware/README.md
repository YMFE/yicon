# koa-webpack-dev-middleware

webpack dev middleware for koa

## Usage

same with https://github.com/webpack/webpack-dev-middleware. will add original middleware to ctx.webpack


```js
var app = require('koa')();
var webpackMiddleware = require("koa-webpack-dev-middleware");
app.use(webpackMiddleware(...));
app.get(function *() {
  this.body = this.webpack.fileSystem.readFileSync('index.html');
});
```

### Example usage

```js
var app = require('koa')();
app.use(webpackMiddleware(webpack({
    // webpack options
    // webpackMiddleware takes a Compiler object as first parameter
    // which is returned by webpack(...) without callback.
    entry: "...",
    output: {
        path: "/"
        // no real path is required, just pass "/"
        // but it will work with other paths too.
    }
}), {
    // all options optional

    noInfo: false,
    // display no info to console (only warnings and errors)

    quiet: false,
    // display nothing to the console

    lazy: true,
    // switch into lazy mode
    // that means no watching, but recompilation on every request

    watchDelay: 300,
    // delay after change (only lazy: false)

    publicPath: "/assets/",
    // public path to bind the middleware to
    // use the same as in webpack

    headers: { "X-Custom-Header": "yes" },
    // custom headers

    stats: {
        colors: true
    }
    // options for formating the statistics
}));
```