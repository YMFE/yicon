import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Header } from '../../components';
import {
  launchDevTools,
} from '../../actions/setting';

import './App.scss';

@connect(
  state => ({ list: state.repository.homeRepository })
)
class App extends Component {
  componentDidMount() {
    if (__DEVTOOLS__ && !window.devToolsExtension) {
      this.props.dispatch(launchDevTools());
    }
  }

  render() {
    const { list } = this.props;

    return (
      <div>
        <Header list={list} />
        <section>
          {this.props.children}
        </section>
      </div>
    );
  }
}

App.propTypes = {
  list: PropTypes.array,
  children: PropTypes.element,
  dispatch: PropTypes.func,
};

export default App;
