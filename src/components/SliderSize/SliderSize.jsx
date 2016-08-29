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
    this.changeSize(value);
  }

  @autobind
  changeSize(value) {
    // this.props.changeIconSize(value);
    const iconsDom = this.props.getIconsDom();
    for (let i = 0, len = iconsDom.length; i < len; i++) {
      const iconDom = iconsDom[i];
      const scale = value / 1024;
      iconDom.style.width = `${value}px`;
      iconDom.style.height = `${value}px`;
      iconDom.getElementsByTagName('g')[1].setAttribute('transform', this.convert({
        translate: { x: 0, y: value },
        scale: { x: scale, y: -scale },
      }));
    }
  }

  convert = (transform) =>
  Object.keys(transform).map(key => {
    const attr = Object.keys(transform[key]).map(k => transform[key][k]).join(',');
    return `${key}(${attr})`;
  }).join(' ');


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
            mark={[16, 32, 48, 64]}
            defaultValue={32}
            onChange={this.onChange}
            ref="slider"
          />
        </div>
        <span
          style={{
            float: 'left',
            color: '#616161',
            fontSize: 16,
            width: '38px',
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
  getIconsDom: PropTypes.func,
};

export default SliderSize;
