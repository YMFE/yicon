import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import './style.scss';

const propTypes = {
  children: PropTypes.element,
};

export default class Dialog extends Component {
  componentDidMount() {
    this.wrapper = document.createElement('div');
    document.body.appendChild(this.wrapper);
    this.appendMaskToDocBody();
  }

  componentDidUpdate() {
    this.appendMaskToDocBody();
  }

  componentWillUnmount() {
    document.body.removeChild(this.wrapper);
  }

  appendMaskToDocBody() {
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      <Modal {...this.props}>
        {this.props.children}
      </Modal>,
      this.wrapper
    );
  }

  render() {
    return null;
  }
}

Dialog.propTypes = propTypes;
