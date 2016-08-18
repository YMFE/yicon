// Karma configuration
var prod = process.env.NODE_ENV !== 'development';

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai-as-promised', 'chai'],
    plugins: [
      require('karma-chai'),
      require('karma-mocha'),
      require('karma-chai-as-promised'),
      require('karma-sourcemap-loader'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-mocha-reporter'),
      require('karma-webpack'),
    ],
    // list of files / patterns to load in the browser
    files: [
      'tests.webpack.js'
    ],
    // list of files to exclude
    exclude: [],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            exclude: /node_modules/,
            loader: 'babel-loader',
            test: /\.jsx?$/,
            query: {
              presets: ['es2015'],
              plugins: [
                "transform-decorators-legacy",
                "transform-object-rest-spread",
                ["transform-runtime", {
                  "polyfill": false,
                  "regenerator": true
                }]
              ]
            }
          }
        ]
      }
    },
    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],
    // web server port
    port: 9876,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: prod ? ['PhantomJS'] : ['Chrome', 'PhantomJS'],
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: prod,
    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
