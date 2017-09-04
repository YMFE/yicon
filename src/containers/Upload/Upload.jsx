import React, { Component, PropTypes } from 'react';

import './Upload.scss';
import Tips from './Tips';
import Uploader from './Uploader';

export default class Upload extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  render() {
    return (
      <div className="yicon-upload-icon">
        <Uploader params={this.props.params} />
        <Tips />
      </div>
    );
  }
}
