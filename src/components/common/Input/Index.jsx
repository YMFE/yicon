import React, { Component, PropTypes } from 'react';
import './style.scss';

const defaultProps = {
  regExp: '',
  error: false,
  errMsg: '',
  getVal(val) { return val; },
  extraClass: '',
};

const propTypes = {
  regExp: PropTypes.string,
  error: PropTypes.bool,
  errMsg: PropTypes.string,
  getVal: PropTypes.func,
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

  validate(val) {
    const regExp = new RegExp(this.props.regExp);
    this.props.getVal(val);
    if (!regExp.test(val)) {
      this.setState({ error: true });
      return;
    }
    this.setState({ error: false });
  }

  render() {
    const { errMsg, extraClass } = this.props;
    const { error } = this.state;
    const classNames = error ? 'input-wrap info-error ' : 'input-wrap';
    return (
      <div className={classNames + extraClass}>
        <input
          type="text"
          className="input"
          placeholder="china"
          onChange={evt => this.validate(evt.target.value)}
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
