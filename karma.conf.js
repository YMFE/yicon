var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    singleRun: !!process.env.CI,
    files: [
      'tests.webpack.js'
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    frameworks: ['mocha', 'chai-as-promised', 'chai'],
    plugins: [
      require('karma-chai'),
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-chai-as-promised'),
      require('karma-sourcemap-loader'),
      require('karma-phantomjs-launcher'),
      require('karma-webpack'),
    ],

    // TODO: 搞成直接引用？
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: {limit: 10240} },
          { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel']},
          { test: /\.scss$/, loader: [
            'style',
            'css' +
              '?modules' +
              '&localIdentName=[path][name]-[local]',
            'postcss',
            'sass' +
              '?outputStyle=expanded',
          ] }
        ]
      },
      resolve: {
        modulesDirectories: [
          'src',
          'node_modules'
        ],
        extensions: ['', '.jsx', '.js']
      },
      plugins: [
        new webpack.IgnorePlugin(/\.json$/),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
          __DEVELOPMENT__: true,
          __DEVTOOLS__: false
        })
      ]
    },
    webpackServer: {
      noInfo: true
    }
  });
};
