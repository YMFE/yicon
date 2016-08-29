#!/bin/bash

# phantomjs prebuild
sudo yum install gcc gcc-c++ make git openssl-devel freetype-devel fontconfig-devel
PHANTOMJS_CDNURL=https://npm.taobao.org/dist/phantomjs npm install phantomjs --registry=https://registry.npm.taobao.org --no-proxy
# node-sass prebuild
SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass
