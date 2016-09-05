#!/bin/bash

# phantomjs prebuild
sudo yum install gcc gcc-c++ make git openssl-devel freetype-devel fontconfig-devel
PHANTOMJS_CDNURL=https://npm.taobao.org/dist/phantomjs sudo npm install phantomjs -g --registry=https://registry.npm.taobao.org --no-proxy
sudo ln -s /usr/lib/node_modules/phantomjs/lib/phantom/bin/phantomjs /usr/local/bin/phantomjs
# node-sass prebuild
SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass
