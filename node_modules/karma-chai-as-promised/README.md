# karma-chai-as-promised
[![NPM version](https://badge.fury.io/js/karma-chai-as-promised.svg)](https://badge.fury.io/js/karma-chai-as-promised) [![Dependency Status](https://david-dm.org/vlkosinov/karma-chai-as-promised.svg)](https://david-dm.org/vlkosinov/karma-chai-as-promised)

chai-as-promised plugin for karma

## Installation
```sh
$ npm install karma-chai-as-promised --save-dev
```
   
## Requirements

This plugin has two peerDependencies with `*` requirement versions:
* [karma-chai](https://github.com/xdissent/karma-chai) 
* [chai-as-promised](https://github.com/domenic/chai-as-promised)

Karma and Chai versions will be resolved by these plug-ins respectively

## Usage

Add `chai-as-promised` to the `frameworks` array in your Karma configuration:

```js
module.exports = function(config) {
  'use strict';
  config.set({
    frameworks: ['mocha', 'chai-as-promised', 'chai'],
    #...
  });
}
```

Keep in mind that, since Karma loads its frameworks in reverse and `chai-as-promised` depends on `chai`, you should declare it accordingly as done above.

License
----

MIT