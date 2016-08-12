import React, { Component, PropTypes } from 'react';

import '../Upload/Upload.scss';
import Footer from '../Upload/Footer';
import Uploader from '../Upload/Uploader';

export default class Replacement extends Component {
  static propTypes = {
    location: PropTypes.object,
  }

  render() {
    const { fromId } = this.props.location.query;
    return (
      <div className="yicon-upload-icon">
        <Uploader
          fromId={+fromId}
          replacement
        />
        <Footer />
      </div>
    );
  }
}
