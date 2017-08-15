import React, { Component, PropTypes } from 'react';

export default class Modal extends Component {
  static defaultProps = {
    title: '',
    visible: false,
    zIndex: 1000,
    onOk: () => {},
    onCancel: () => {},
    confrimText: '确定',
    cancelText: '取消',
    empty: false,
    getShow(val) { return val; },
  };

  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    zIndex: PropTypes.number,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    confrimText: PropTypes.string,
    cancelText: PropTypes.string,
    empty: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.element),
    ]),
    getShow: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { show: props.visible };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ show: nextProps.visible });
  }

  close() {
    this.setState({ show: false });
    this.props.getShow(false);
    this.props.onCancel();
  }
  render() {
    const { title, zIndex, onOk, onCancel, empty, confrimText, cancelText } = this.props;
    // 代码里德 show 属性暂时不屏蔽 测试是否影响其他页面的功能
    // document.body.style.cssText = this.state.show ? 'overflow: hidden' : '';
    return (
      <div
        style={{
          display: this.state.show ? null : 'none',
        }}
      >
        <div className="m-dialog-mask" style={{ zIndex: zIndex - 1 }}></div>
        <div className="m-dialog-back">
          <div className={empty ? 'm-dialog m-dialog-simple' : 'm-dialog'} style={{ zIndex }}>
            <div className="myicon-dialog">
              <div className="myicon-dialog-title">
                <h4>{title}</h4>
                <span className="ibtns">
                  <i className="iconfont" onClick={() => this.close()}>&#xf077;</i>
                </span>
              </div>
              <div className="myicon-dialog-content">
                {this.props.children}
              </div>
              <div className="myicon-dialog-foot">
                <button className="options-btns btns-default" onClick={onCancel}>
                  {cancelText}
                </button>
                <button className="options-btns btns-blue" onClick={onOk}>{confrimText}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
