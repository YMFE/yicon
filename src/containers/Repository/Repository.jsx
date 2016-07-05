import React, { Component, PropTypes } from 'react';

export default class Repository extends Component {
  render() {
    const { id } = this.props.params;
    return (
      <div>
        <h1>Repository</h1>
        <p>This is repository page. Id: {id}.</p>
      </div>
    );
  }
}

Repository.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
};
