import './SliderSize.scss';
import Slider from '../common/Slider/Slider.jsx';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  changeIconSize,
} from '../../actions/repository';
import { autobind } from 'core-decorators';

@connect(
  null,
  { changeIconSize },
  null,
  { withRef: true }
)
class SliderSize extends Component {

  constructor(props) {
    super(props);
    // const { iconSize } = props;

    this.state = {
      sizeTxt: 32,
    };
  }

  @autobind
  onChange(value) {
    this.setState({
      sizeTxt: value,
    });
  }

  @autobind
  changeSize(value) {
    this.props.changeIconSize(value);
  }

  @autobind
  reset() {
    this.refs.slider.reset();
  }

  render() {
    // const { iconSize } = this.props;
    return (
      <div style={{ float: 'right' }}>
        <div style={{ width: 216, padding: 11, float: 'left' }}>
          <Slider
            min={16}
            max={64}
            step={1}
            defaultValue={32}
            onAfterChange={this.changeSize}
            onChange={this.onChange}
            ref="slider"
          />
        </div>
        <span
          style={{
            float: 'left',
            color: '#616161',
            fontSize: 16,
            lineHeight: '38px',
          }}
        >{this.state.sizeTxt}px</span>
      </div>
    );
  }
}

SliderSize.propTypes = {
  iconSize: PropTypes.number,
  changeIconSize: PropTypes.func,
};

export default SliderSize;
