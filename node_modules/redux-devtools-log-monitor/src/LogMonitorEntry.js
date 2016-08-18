import React, { PropTypes, Component } from 'react';
import JSONTree from 'react-json-tree';
import LogMonitorEntryAction from './LogMonitorEntryAction';
import shouldPureComponentUpdate from 'react-pure-render/function';

const styles = {
  entry: {
    display: 'block',
    WebkitUserSelect: 'none'
  },
  tree: {
    paddingLeft: 0
  }
};

export default class LogMonitorEntry extends Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    action: PropTypes.object.isRequired,
    actionId: PropTypes.number.isRequired,
    select: PropTypes.func.isRequired,
    error: PropTypes.string,
    onActionClick: PropTypes.func.isRequired,
    collapsed: PropTypes.bool,
    expandActionRoot: PropTypes.bool,
    expandStateRoot: PropTypes.bool
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
    this.handleActionClick = this.handleActionClick.bind(this);
    this.shouldExpandNode = this.shouldExpandNode.bind(this);
  }

  printState(state, error) {
    let errorText = error;
    if (!errorText) {
      try {
        return (
          <JSONTree
            theme={this.props.theme}
            keyPath={['state']}
            data={this.props.select(state)}
            previousData={
              typeof this.props.previousState !== 'undefined' ?
                this.props.select(this.props.previousState) :
                undefined
            }
            shouldExpandNode={this.shouldExpandNode}
            style={styles.tree} />
        );
      } catch (err) {
        errorText = 'Error selecting state.';
      }
    }

    return (
      <div style={{
        color: this.props.theme.base08,
        paddingTop: 20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 35
      }}>
        {errorText}
      </div>
    );
  }

  handleActionClick() {
    const { actionId, onActionClick } = this.props;
    if (actionId > 0) {
      onActionClick(actionId);
    }
  }

  shouldExpandNode() {
    return this.props.expandStateRoot;
  }

  render() {
    const { actionId, error, action, state, collapsed } = this.props;
    const styleEntry = {
      opacity: collapsed ? 0.5 : 1,
      cursor: (actionId > 0) ? 'pointer' : 'default'
    };

    return (
      <div style={{
        textDecoration: collapsed ? 'line-through' : 'none',
        color: this.props.theme.base06
      }}>
        <LogMonitorEntryAction
          theme={this.props.theme}
          collapsed={collapsed}
          action={action}
          expandActionRoot={this.props.expandActionRoot}
          onClick={this.handleActionClick}
          style={{...styles.entry, ...styleEntry}}/>
        {!collapsed &&
          <div>
            {this.printState(state, error)}
          </div>
        }
      </div>
    );
  }
}
