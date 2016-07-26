import React, { Component, PropTypes } from 'react';
const defaultProps = {
  title: '',
  visible: false,
  zIndex: 1000,
  onOk: () => {},
  onCancel: () => {},
  empty: false,
};

const propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  zIndex: PropTypes.number,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  empty: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = { show: props.visible };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ show: nextProps.visible });
  }

  render() {
    const { title, zIndex, onOk, onCancel, empty } = this.props;
    document.body.style = this.state.show ? 'overflow: hidden' : '';
    return (
      <div
        style={{
          display: this.state.show ? null : 'none',
        }}
      >
        <div className="m-dialog-mask" style={{ zIndex: zIndex - 1 }}></div>
        <div className={empty ? 'm-dialog m-dialog-simple' : 'm-dialog'} style={{ zIndex }}>
          <div className="myicon-dialog">
            <div className="myicon-dialog-title">
              <h4>{title}</h4>
              <span className="ibtns">
                <i className="iconfont" onClick={() => this.setState({ show: false })}>&#xf077;</i>
              </span>
            </div>
            <div className="myicon-dialog-content">
              {this.props.children}
            </div>
            <div className="myicon-dialog-foot">
              <a href="#" className="options-btns btns-default" onClick={onCancel}>取消</a>
              <a href="#" className="options-btns btns-blue" onClick={onOk}>确定</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.defaultProps = defaultProps;
Modal.propTypes = propTypes;
