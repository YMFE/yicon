import Modal from './Index';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import process from 'process';

let that = null;
let container = null;
class ConfirmReact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dTitle: '',
      dContent: '',
      onOk: () => {},
      onCancel: () => {},
      zIndex: 1000,
      empty: false,
    };
    that = this;
  }

  componentWillUnmount() {
    document.removeChild(container);
  }

  render() {
    const { visible, dTitle, dContent, onOk, onCancel, zIndex, empty } = this.state;
    return (
      <Modal
        visible={visible}
        title={dTitle}
        onOk={onOk}
        onCancel={onCancel}
        zIndex={zIndex}
        empty={empty}
      >
        {dContent}
      </Modal>
    );
  }
}

if (process.browser) {
  container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(<ConfirmReact />, container);
}

function transFn(fn) {
  return () => {
    const callback = () => {
      that.setState({ visible: false });
    };
    const result = fn(callback);
    // 当返回值不是 false 时，就关闭对话框
    if (result !== false) {
      that.setState({ visible: false });
    }
  };
}

export default function Confirm({
  title,
  content,
  onOk,
  onCancel,
  zIndex = 1000,
  empty = false,
}) {
  that.setState({
    visible: true,
    dTitle: title,
    dContent: content,
    onOk: transFn(onOk),
    onCancel: transFn(onCancel),
    zIndex,
    empty,
  });
}
