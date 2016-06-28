import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { Header } from '../../components';
import {
  launchDevTools,
} from '../../actions/setting';

import './App.scss';

@connect()
class App extends Component {
  componentDidMount() {
    if (__DEVTOOLS__ && !window.devToolsExtension) {
      this.props.dispatch(launchDevTools());
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <Header />
          <section>
            {this.props.children}
          </section>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  dispatch: PropTypes.func,
};

export default App;
