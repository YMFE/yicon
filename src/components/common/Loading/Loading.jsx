import './Loading.scss';
import React, { PropTypes, Component } from 'react';
export default class Loading extends Component {
  static defaultProps = {
    visible: false,
    // zIndex: 9999,
    // onShow:() => {},
    // onHide:() => {},
  }
  static propTypes = {
    visible: PropTypes.bool,
    // onShow: PropTypes.func,
    // onHide: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = { show: props.visible };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ show: nextProps.visible });
  }
  render() {
    // const { type } = this.props.params; <div className="g-loading-bg"></div>
    return (
      <div
        className="g-loading"
        style={{ display: this.state.show ? null : 'none' }}
      >
        <div className="g-loading-bg"></div>
        <span className="g-loading-pic"></span>
      </div>
    );
  }
}
