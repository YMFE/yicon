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
global.__DEVELOPMENT__ = process.env.NODE_ENV === 'development';

var logger = require('../src/logger');
console.log('🐸  🐸  🐸   dev-env: ', __DEVELOPMENT__);

// for material-ui
global.navigator = { userAgent: 'all' };

var Wit = require('webpack-isomorphic-tools');
var witConfig = require('../webpack/webpack-isomorphic-tools');

global.webpackIsomorphicTools = new Wit(witConfig)
  .development(__DEVELOPMENT__)
  .server(rootDir, function() {
    require('../src/server');
  });
