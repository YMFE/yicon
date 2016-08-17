import React, { Component, PropTypes } from 'react';

import '../Upload/Upload.scss';
import Tips from '../Upload/Tips';
import Uploader from '../Upload/Uploader';
import Footer from '../../components/Footer/Footer';

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
        <Tips />
        <Footer />
      </div>
    );
  }
}
