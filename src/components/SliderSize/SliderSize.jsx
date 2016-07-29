import './SliderSize.scss';
import Slider from '../common/Slider/Slider.jsx';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  changeIconSize,
} from '../../actions/repository';
import { autobind } from 'core-decorators';

@connect(
  state => ({
    iconSize: state.repository.iconSize,
  }),
  { changeIconSize }
)
class SliderSize extends Component {
  @autobind
  changeSize(value) {
    this.props.changeIconSize(value);
  }

  render() {
    const { iconSize } = this.props;
    return (
      <div style={{ float: 'right' }}>
        <div style={{ width: 216, padding: 11, float: 'left' }}>
          <Slider
            min={16}
            max={64}
            step={1}
            defaultValue={64}
            value={iconSize}
            onChange={this.changeSize}
          />
        </div>
        <span
          style={{
            float: 'left',
            color: '#616161',
            fontSize: 16,
            lineHeight: '38px',
          }}
        >{iconSize}px</span>
      </div>
    );
  }
}

SliderSize.propTypes = {
  iconSize: PropTypes.number,
  changeIconSize: PropTypes.func,
};

export default SliderSize;
