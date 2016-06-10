import React, { PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Header from '../../components/Header/Header';

import './App.scss';

const App = (props) => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <div>
      <Header />
      <section>
        {props.children}
      </section>
    </div>
  </MuiThemeProvider>
);

App.propTypes = {
  children: PropTypes.element,
};

export default App;
