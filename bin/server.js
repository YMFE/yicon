#!/usr/bin/env node
require('../server.babel');
var path = require('path');
var rootDir = path.resolve(__dirname, '..');
/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
var witConfig = require('../webpack/webpack-isomorphic-tools');

global.webpackIsomorphicTools = new WebpackIsomorphicTools(witConfig)
  .development(__DEVELOPMENT__)
  .server(rootDir, function() {
    require('../src/server');
  });

