# koa-webpack-hot-middleware

webpack hot reload middleware for koa

## Usage

same with https://github.com/glenjamin/webpack-hot-middleware

# Webpack Hot Middleware

Webpack hot reloading using only [webpack-dev-middleware](http://webpack.github.io/docs/webpack-dev-middleware.html). This allows you to add hot reloading into an existing server without [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html).

## Installation & Usage

See [example/](./example/) for an example of usage.

First, install the npm module.

```sh
npm install --save-dev koa-webpack-hot-middleware
```

Next, enable hot reloading in your webpack config:

 1. Add the following three plugins to the `plugins` array:
    ```js
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
    ```
    Occurence ensures consistent build hashes, hot module replacement is
    somewhat self-explanatory, no errors is used to handle errors more cleanly.

 3. Add `'webpack-hot-middleware/client'` into the `entry` array.
    This connects to the server to receive notifications when the bundle
    rebuilds and then updates your client bundle accordingly.

Now add the middleware into your server:

 1. Add `webpack-dev-middleware` the usual way
    ```js
    var webpack = require('webpack');
    var webpackConfig = require('./webpack.config');
    var compiler = webpack(webpackConfig);

    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true, publicPath: webpackConfig.output.publicPath
    }));
    ```

 2. Add `koa-webpack-hot-middleware` attached to the same compiler instance
    ```js
    app.use(require("koa-webpack-hot-middleware")(compiler));
    ```

And you're all set!

## License

Copyright 2015 Glen Mailer.

MIT Licened.
