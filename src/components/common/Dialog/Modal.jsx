import React, { Component, PropTypes } from 'react';
const defaultProps = {
  title: '',
  visible: false,
  zindex: 1000,
  onOk: () => {},
  onCancel: () => {},
};

const propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  zindex: PropTypes.number,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  children: PropTypes.element,
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
    const { title, zindex, onOk, onCancel } = this.props;
    document.body.style = this.state.show ? 'overflow: hidden' : '';
    return (
      <div
        style={{
          display: this.state.show ? null : 'none',
        }}
      >
        <div className="m-dialog-mask" style={{ zIndex: zindex - 1 }}></div>
        <div className="m-dialog" style={{ zIndex: zindex }}>
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
