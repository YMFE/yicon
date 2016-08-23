import React, { Component, PropTypes } from 'react';
import './Slider.scss';
import { autobind } from 'core-decorators';

function noop() {
}

function pauseEvent(e) {
  e.stopPropagation();
  e.preventDefault();
}

function getMousePosition(e) {
  return e.pageX;
}

class Slider extends Component {

  constructor(props) {
    super(props);

    const { max } = props;
    const initialValue = max;
    const defaultValue = ('defaultValue' in props ? props.defaultValue : initialValue);
    const value = (props.value !== undefined ? props.value : defaultValue);

    this.state = { bound: value };
  }

  // componentWillReceiveProps(nextProps) {
  //   const { min } = nextProps;
  //   const initialValue = min;
  //   const defaultValue = ('defaultValue' in nextProps ? nextProps.defaultValue : initialValue);
  //   const value = (nextProps.value !== undefined ? nextProps.value : defaultValue);
  //
  //   this.setState({
  //     bound: value,
  //   });
  // }

  onChange(value) {
    this.setState({
      bound: value,
    });
    this.props.onChange(value);
  }

  @autobind
  onMouseMove(e) {
    const position = getMousePosition(e);
    this.onMove(e, position);
  }

  onMove(e, position) {
    pauseEvent(e);
    const state = this.state;

    const value = this.calcValueByPos(position);
    const oldValue = state.bound;
    if (value === oldValue) return;

    this.onChange(value);
  }

  onStart(position) {
    const props = this.props;
    props.onBeforeChange(this.getValue());

    const value = this.calcValueByPos(position);
    this.startValue = value;
    this.startPosition = position;

    const state = this.state;

    const oldValue = state.bound;
    if (value === oldValue) return;

    this.onChange(value);
  }

  @autobind
  onMouseDown(e) {
    if (e.button !== 0) { return; }
    const position = getMousePosition(e);
    this.onStart(position);
    this.addDocumentEvents();
    pauseEvent(e);
  }

  getValue() {
    return this.state.bound;
  }

  getSliderStart() {
    const slider = this.refs.slider;
    const rect = slider.getBoundingClientRect();

    return rect.left + slider.clientLeft;
  }

  getSliderLength() {
    const slider = this.refs.slider;
    if (!slider) {
      return 0;
    }

    return slider.clientWidth;
  }

  validValue(value) {
    const { min, max } = this.props;
    let val = value;
    if (val <= min) {
      val = min;
    } else if (val >= max) {
      val = max;
    }
    return val;
  }

  calcOffset(value) {
    const { min, max } = this.props;
    const ratio = (value - min) / (max - min);
    return ratio * 100;
  }

  calcValueByPos(position) {
    const pixelOffset = position - this.getSliderStart();
    const nextValue = this.validValue(this.calcValue(pixelOffset));
    return nextValue;
  }

  addDocumentEvents() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.end);
  }

  calcValue(offset) {
    const { min, max, step } = this.props;
    const ratio = offset / this.getSliderLength();
    const value = ratio * (max - min) + min;
    return Math.round(value / step) * step;
  }

  removeEvents() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.end);
  }

  @autobind
  end() {
    const { step } = this.props;
    const value = this.state.bound;
    const newValue = Math.round(value / step) * step;

    this.setState({
      bound: newValue,
    });
    this.removeEvents();
    this.props.onAfterChange(this.getValue());
  }

  @autobind
  reset() {
    const defaultValue = this.props.defaultValue || this.props.max;
    this.props.onBeforeChange(this.getValue());
    this.setState({
      bound: defaultValue,
    });
    this.props.onChange(defaultValue);
    this.props.onAfterChange(defaultValue);
  }

  render() {
    const { bound } = this.state;
    const { disabled } = this.props;
    const offset = this.calcOffset(bound);
    return (
      <div
        ref="slider"
        className={"slider"}
        onMouseDown={disabled ? noop : this.onMouseDown}
      >
        <span className={"slider-track-bar"} style={{ width: `${offset}%` }}></span>
        <span className={"slider-handle"} style={{ left: `${offset}%` }}></span>
      </div>
    );
  }
}

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  defaultValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  disabled: PropTypes.bool,
  onBeforeChange: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onAfterChange: React.PropTypes.func,
};

Slider.defaultProps = {
  disabled: false,
  min: 0,
  max: 100,
  step: 1,
  onBeforeChange: noop,
  onChange: noop,
  onAfterChange: noop,
};

export default Slider;
