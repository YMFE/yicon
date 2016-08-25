import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import './style.scss';

const defaultProps = {
  regExp: '',
  errMsg: '',
  defaultValue: '',
  extraClass: '',
  error: false,
  strict: false,
  onChange: () => {},
  blur: () => {},
  keyDown: () => {},
};

const propTypes = {
  regExp: PropTypes.any,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  strict: PropTypes.bool,
  errMsg: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  blur: PropTypes.func,
  keyDown: PropTypes.func,
  extraClass: PropTypes.string,
  children: PropTypes.oneOfType([
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
      value: props.defaultValue,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      error: nextProps.error,
      value: nextProps.defaultValue,
    });
  }

  getVal() {
    return this.state.value;
  }

  @autobind
  isError() {
    return this.state.error;
  }

  validate(val) {
    let regExp;
    let error;
    if (this.props.regExp instanceof RegExp) {
      regExp = this.props.regExp;
    } else {
      regExp = new RegExp(this.props.regExp);
    }
    if (!regExp.test(val)) {
      error = true;
    } else {
      error = false;
    }
    if (!this.props.strict) {
      this.setState({
        error,
        value: val,
      }, this.props.onChange(val, error));
    } else {
      if (!error) {
        this.setState({ value: val }, this.props.onChange(val, error));
      }
    }
  }

  @autobind
  keyDown(e) {
    if (!this.state.error) {
      this.props.keyDown(e, this.getVal());
    }
  }
  @autobind
  blur() {
    if (!this.state.error) {
      this.props.blur(this.getVal());
    } else {
      this.reset();
    }
  }

  reset() {
    this.setState({
      error: false,
      value: this.props.defaultValue,
    });
  }

  render() {
    const { errMsg, extraClass, placeholder } = this.props;
    const { error, value } = this.state;
    const classNames = error ? 'input-wrap info-error ' : 'input-wrap';
    return (
      <div className={`${classNames} ${extraClass}`}>
        <input
          value={value || ''}
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
