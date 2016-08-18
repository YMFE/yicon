# React-Clipboard

React wrapper for [clipboard.js](http://zenorocha.github.io/clipboard.js/)

[![Build
Status](https://travis-ci.org/nihey/react-clipboard.js.svg)](https://travis-ci.org/nihey/react-clipboard.js)
[![Dependency
Status](https://david-dm.org/nihey/react-clipboard.js.png)](https://david-dm.org/nihey/react-clipboard.js)

# Installation
```
$ npm i --save react-clipboard.js
```

# Usage
You can use `clipboard.js` original `data-*` attributes:
```javascript
var React = require('react');
var ClipboardButton = require('react-clipboard.js');

var MyView = React.createClass({
  render: function() {
    return <div>
      <ClipboardButton data-clipboard-text="I'll be copied">
        copy to clipboard
      </ClipboardButton>
    </div>;
  },
});

React.render(<MyView/>, document.getElementById('react-body'));
```

- If you want to provide any constructor option as in `new Clipboard('#id', options)`,
  you may use `option-*` attributes

- callbacks will be connected via `on*` attributes (such as onSuccess)
```javascript
var React = require('react');
var ClipboardButton = require('react-clipboard.js');

var MyView = React.createClass({
  onSuccess: function() {
    console.info('successfully coppied');
  },

  getText: function() {
    return 'I\'ll be copied';
  },

  render: function() {
    // Providing option-text as this.getText works the same way as providing:
    //
    // var clipboard = new Clipboard('#anything', {
    //   text: this.getText,
    // });
    //
    // onSuccess works as a 'success' callback:
    //
    // clipboard.on('success', this.onSuccess);
    return <div>
      <ClipboardButton option-text={this.getText} onSuccess={this.onSuccess}>
        copy to clipboard
      </ClipboardButton>
    </div>;
  },
});

React.render(<MyView/>, document.getElementById('react-body'));
```

Custom HTML tags may be used as well:
```javascript
var React = require('react');
var Clipboard = require('react-clipboard.js');

var MyView = React.createClass({
  render: function() {
    // Clipboard is now rendered as an '<a>'
    return <div>
      <Clipboard component="a" button-href="#" data-clipboard-text="I'll be copied">
        copy to clipboard
      </Clipboard>
    </div>;
  },
});

...
```

Default html properties may be passed with the `button-*` pattern:
```javascript
var React = require('react');
var ClipboardButton = require('react-clipboard.js');

var MyView = React.createClass({
  render: function() {
    return <div>
      <ClipboardButton data-clipboard-text="I'll be copied" button-title="I'm a tooltip">
        copy to clipboard
      </ClipboardButton>
    </div>;
  },
});

React.render(<MyView/>, document.getElementById('react-body'));
```

# License

This code is released under
[CC0](http://creativecommons.org/publicdomain/zero/1.0/) (Public Domain)
