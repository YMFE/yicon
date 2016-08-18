import React from 'react';

export default class ClipboardButton extends React.Component {
  static propTypes: {
     options: React.PropTypes.object,
     type: React.PropTypes.string,
     className: React.PropTypes.string,
     style: React.PropTypes.string,
     component: React.PropTypes.string,
     children: React.PropTypes.object
  }

  /* Returns a object with all props that fulfill a certain naming pattern
   *
   * @param {RegExp} regexp - Regular expression representing which pattern
   *                          you'll be searching for.
   * @param {Boolean} remove - Determines if the regular expression should be
   *                           removed when transmitting the key from the props
   *                           to the new object.
   *
   * e.g:
   *
   * // Considering:
   * // this.props = {option-foo: 1, onBar: 2, data-foobar: 3 data-baz: 4};
   *
   * // *RegExps not using // so that this comment doesn't break up
   * this.propsWith(option-*, true); // returns {foo: 1}
   * this.propsWith(on*, true); // returns {Bar: 2}
   * this.propsWith(data-*); // returns {data-foobar: 1, data-baz: 4}
   */
  propsWith(regexp, remove=false) {
    const object = {};

    Object.keys(this.props).forEach(function(key) {
      if (key.search(regexp) !== -1) {
        const objectKey = remove ? key.replace(regexp, '') : key;
        object[objectKey] = this.props[key];
      }
    }, this);

    return object;
  }

  componentWillUnmount() {
    this.clipboard && this.clipboard.destroy();
  }

  componentDidMount() {
    // Support old API by trying to assign this.props.options first;
    const options = this.props.options || this.propsWith(/^option-/, true);
    const element = React.version.match(/0\.13(.*)/)
        ? this.refs.element.getDOMNode() : this.refs.element;
    const Clipboard = require('clipboard');
    this.clipboard = new Clipboard(element, options);

    const callbacks = this.propsWith(/^on/, true);
    Object.keys(callbacks).forEach(function(callback) {
      this.clipboard.on(callback.toLowerCase(), this.props['on' + callback]);
    }, this);
  }

  render() {
    const attributes = {
      type: this.getType(),
      className: this.props.className || '',
      style: this.props.style || {},
      ref: 'element',
      ...this.propsWith(/^data-/),
      ...this.propsWith(/^button-/, true),
    };

    return React.createElement(
      this.getComponent(),
      attributes,
      this.props.children
    );
  }

  getType() {
    if (this.getComponent() === 'button' || this.getComponent() === 'input') {
      return this.props.type || 'button';
    }
    else {
      return undefined;
    }
  }

  getComponent() {
    return this.props.component || 'button';
  }
}
