import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>App</h1>
        <p><Link to="/">Home</Link></p>
        <p><Link to="/project">Project</Link></p>
        <p><Link to="/repository">Repository</Link></p>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
};
