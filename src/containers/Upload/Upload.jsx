import React, { Component } from 'react';

import './Upload.scss';
import Tips from './Tips';
import Uploader from './Uploader';
import Footer from '../../components/Footer/Footer';

export default class Upload extends Component {
  render() {
    return (
      <div className="yicon-upload-icon">
        <Uploader />
        <Tips />
        <Footer />
      </div>
    );
  }
}
