import React, { PropTypes, Component } from 'react';
import LogMonitorButton from './LogMonitorButton';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as themes from 'redux-devtools-themes';
import { ActionCreators } from 'redux-devtools';
import { updateScrollTop } from './actions';
import reducer from './reducers';
import LogMonitorEntryList from './LogMonitorEntryList';
import debounce from 'lodash.debounce';

const { reset, rollback, commit, sweep, toggleAction } = ActionCreators;

const styles = {
  container: {
    fontFamily: 'monaco, Consolas, Lucida Console, monospace',
    position: 'relative',
    overflowY: 'hidden',
    width: '100%',
    height: '100%',
    minWidth: 300,
    direction: 'ltr'
  },
  buttonBar: {
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: 'transparent',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row'
  },
  elements: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 38,
    bottom: 0,
    overflowX: 'hidden',
    overflowY: 'auto'
  }
};

export default class LogMonitor extends Component {
  static update = reducer;

  static propTypes = {
    dispatch: PropTypes.func,
    computedStates: PropTypes.array,
    actionsById: PropTypes.object,
    stagedActionIds: PropTypes.array,
    skippedActionIds: PropTypes.array,
    monitorState: PropTypes.shape({
      initialScrollTop: PropTypes.number
    }),

    preserveScrollTop: PropTypes.bool,
    select: PropTypes.func,
    theme: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]),
    expandActionRoot: PropTypes.bool,
    expandStateRoot: PropTypes.bool,
    markStateDiff: PropTypes.bool
  };

  static defaultProps = {
    select: (state) => state,
    theme: 'nicinabox',
    preserveScrollTop: true,
    expandActionRoot: true,
    expandStateRoot: true,
    markStateDiff: false
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  updateScrollTop = debounce(() => {
    const node = this.refs.container;
    this.props.dispatch(updateScrollTop(node ? node.scrollTop : 0));
  }, 500);

  constructor(props) {
    super(props);
    this.handleToggleAction = this.handleToggleAction.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleRollback = this.handleRollback.bind(this);
    this.handleSweep = this.handleSweep.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
  }

  scroll() {
    const node = this.refs.container;
    if (!node) {
      return;
    }
    if (this.scrollDown) {
      const { offsetHeight, scrollHeight } = node;
      node.scrollTop = scrollHeight - offsetHeight;
      this.scrollDown = false;
    }
  }

  componentDidMount() {
    const node = this.refs.container;
    if (!node || !this.props.monitorState) {
      return;
    }

    if (this.props.preserveScrollTop) {
      node.scrollTop = this.props.monitorState.initialScrollTop;
      node.addEventListener('scroll', this.updateScrollTop);
    } else {
      this.scrollDown = true;
      this.scroll();
    }
  }

  componentWillUnmount() {
    const node = this.refs.container;
    if (node && this.props.preserveScrollTop) {
      node.removeEventListener('scroll', this.updateScrollTop);
    }
  }

  componentWillReceiveProps(nextProps) {
    const node = this.refs.container;
    if (!node) {
      this.scrollDown = true;
    } else if (
      this.props.stagedActionIds.length <
      nextProps.stagedActionIds.length
    ) {
      const { scrollTop, offsetHeight, scrollHeight } = node;

      this.scrollDown = Math.abs(
        scrollHeight - (scrollTop + offsetHeight)
      ) < 20;
    } else {
      this.scrollDown = false;
    }
  }

  componentDidUpdate() {
    this.scroll();
  }

  handleRollback() {
    this.props.dispatch(rollback());
  }

  handleSweep() {
    this.props.dispatch(sweep());
  }

  handleCommit() {
    this.props.dispatch(commit());
  }

  handleToggleAction(id) {
    this.props.dispatch(toggleAction(id));
  }

  handleReset() {
    this.props.dispatch(reset());
  }

  getTheme() {
    let { theme } = this.props;
    if (typeof theme !== 'string') {
      return theme;
    }

    if (typeof themes[theme] !== 'undefined') {
      return themes[theme];
    }

    console.warn('DevTools theme ' + theme + ' not found, defaulting to nicinabox');
    return themes.nicinabox;
  }

  render() {
    const theme = this.getTheme();
    const {
      actionsById,
      skippedActionIds,
      stagedActionIds,
      computedStates,
      currentStateIndex,
      select,
      expandActionRoot,
      expandStateRoot,
      markStateDiff
    } = this.props;

    const entryListProps = {
      theme,
      actionsById,
      skippedActionIds,
      stagedActionIds,
      computedStates,
      currentStateIndex,
      select,
      expandActionRoot,
      expandStateRoot,
      markStateDiff,
      onActionClick: this.handleToggleAction
    };

    return (
      <div style={{...styles.container, backgroundColor: theme.base00}}>
        <div style={{...styles.buttonBar, borderColor: theme.base02}}>
          <LogMonitorButton
            theme={theme}
            onClick={this.handleReset}
            enabled>
            Reset
          </LogMonitorButton>
          <LogMonitorButton
            theme={theme}
            onClick={this.handleRollback}
            enabled={computedStates.length > 1}>
            Revert
          </LogMonitorButton>
          <LogMonitorButton
            theme={theme}
            onClick={this.handleSweep}
            enabled={skippedActionIds.length > 0}>
            Sweep
          </LogMonitorButton>
          <LogMonitorButton
            theme={theme}
            onClick={this.handleCommit}
            enabled={computedStates.length > 1}>
            Commit
          </LogMonitorButton>
        </div>
        <div style={styles.elements} ref='container'>
          <LogMonitorEntryList {...entryListProps} />
        </div>
      </div>
    );
  }
}
