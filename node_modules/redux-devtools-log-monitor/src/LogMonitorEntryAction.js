import React, { Component } from 'react';
import JSONTree from 'react-json-tree';

const styles = {
  actionBar: {
    paddingTop: 8,
    paddingBottom: 7,
    paddingLeft: 16
  },
  payload: {
    margin: 0,
    overflow: 'auto'
  }
};

export default class LogMonitorAction extends Component {
  constructor(props) {
    super(props);
    this.shouldExpandNode = this.shouldExpandNode.bind(this);
  }

  renderPayload(payload) {
    return (
      <div style={{
        ...styles.payload,
        backgroundColor: this.props.theme.base00
      }}>
        { Object.keys(payload).length > 0 ?
          <JSONTree theme={this.props.theme}
                    keyPath={['action']}
                    data={payload}
                    shouldExpandNode={this.shouldExpandNode} /> : '' }
      </div>
    );
  }

  shouldExpandNode() {
    return this.props.expandActionRoot;
  }

  render() {
    const { type, ...payload } = this.props.action;
    return (
      <div style={{
        backgroundColor: this.props.theme.base02,
        color: this.props.theme.base06,
        ...this.props.style
      }}>
        <div style={styles.actionBar}
          onClick={this.props.onClick}>
          {type.toString()}
        </div>
        {!this.props.collapsed ? this.renderPayload(payload) : ''}
      </div>
    );
  }
}
