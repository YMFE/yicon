import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import './style.scss';

const defaultProps = {
  regExp: '',
  error: false,
  errMsg: '',
  onChange: () => {},
  blur: () => {},
  keyDown: () => {},
  extraClass: '',
};

const propTypes = {
  regExp: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  errMsg: PropTypes.string,
  onChange: PropTypes.func,
  blur: PropTypes.func,
  keyDown: PropTypes.func,
  extraClass: PropTypes.string,
  children: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: props.error,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ error: nextProps.error });
  }

  getVal() {
    return this.refs.input.value;
  }

  validate(val) {
    const regExp = new RegExp(this.props.regExp);
    this.props.onChange(val);
    if (!regExp.test(val)) {
      this.setState({ error: true });
      return;
    }
    this.setState({ error: false });
  }

  @autobind
  keyDown(e) {
    this.props.keyDown(e);
  }
  @autobind
  blur(e) {
    this.props.blur(e);
  }

  reset() {
    this.refs.input.value = '';
  }

  render() {
    const { errMsg, extraClass, placeholder } = this.props;
    const { error } = this.state;
    const classNames = error ? 'input-wrap info-error ' : 'input-wrap';
    return (
      <div className={`${classNames} ${extraClass}`}>
        <input
          type="text"
          className="input"
          placeholder={placeholder}
          onChange={evt => this.validate(evt.target.value)}
          onKeyDown={this.keyDown}
          onBlur={this.blur}
          ref="input"
        />
      {this.props.children}
        <div
          className="error-info" style={{ display: this.state.error ? '' : 'none' }}
        >{errMsg}</div>
      </div>
    );
  }
}

Input.defaultProps = defaultProps;
Input.propTypes = propTypes;
