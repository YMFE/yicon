var Koa = require('koa');
var webpack = require('webpack');

var webpackConfig = require('./dev.config');
var compiler = webpack(webpackConfig);

var host = process.env.HOST || 'localhost';
var port = (+process.env.PORT + 1) || 3001;
var serverOptions = {
  contentBase: 'http://' + host + ':' + port,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};

var app = new Koa();

app.use(require('koa-webpack-dev-middleware')(compiler, serverOptions));
app.use(require('koa-webpack-hot-middleware')(compiler));

app.listen(port);
