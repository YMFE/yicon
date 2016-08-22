#!/bin/bash

# phantomjs install
sudo yum install gcc gcc-c++ make git openssl-devel freetype-devel fontconfig-devel
PHANTOMJS_CDNURL=https://npm.taobao.org/dist/phantomjs npm install phantomjs --registry=https://registry.npm.taobao.org --no-proxy
