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
    };
    that = this;
  }

  componentWillUnmount() {
    document.removeChild(container);
  }

  render() {
    const { visible, dTitle, dContent, onOk, onCancel, zIndex } = this.state;
    return (
      <Modal
        visible={visible}
        title={dTitle}
        onOk={onOk}
        onCancel={onCancel}
        zindex={zIndex}
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
  const regExp = /new\s+Promise/g;
  const str = fn.toString();

  return regExp.test(str) ?
        () => fn().then(() => that.setState({ visible: false }))
        : () => { fn(); that.setState({ visible: false }); return null; };
}

export default function Confirm({
  title,
  content,
  onOk,
  onCancel,
  zindex = 1000,
}) {
  that.setState({
    visible: true,
    dTitle: title,
    dContent: content,
    onOk: transFn(onOk),
    onCancel: transFn(onCancel),
    zIndex: zindex,
  });
}
