import './Slick.scss';
import React, { Component, PropTypes } from 'react';
// import Icon from '../Icon/Icon.jsx';
export default class Slick extends Component {
  static defaultProps = {
    defaultTranslateX: 0,
    // leftStep: 84 * 12,
    leftStep: 1008,
  }
  static propTypes = {
    currentItem: PropTypes.number,
    defaultCurrent: PropTypes.number,
    defaultTranslateX: PropTypes.number,
    directionNav: PropTypes.bool,
    onClick: PropTypes.func,
    onDelete: PropTypes.func,
    // iconItemListPos: PropTypes.object,
    leftStep: PropTypes.number,
    itemData: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {
      currentItem: this.props.defaultCurrent,
      defaultTranslateX: this.props.defaultTranslateX,
    // iconItemListPos: Object.assign({}, this.props.iconItemListPos),
      scrollAreaWidth: 0,
    };
  }
  componentWillMount() {
    const { itemData } = this.props;
    const uiWidth = 84 * itemData.length;
    this.setState({ scrollAreaWidth: uiWidth });
  }
  handleClick(config, evt) {
    const { type, index } = config;
    const { currentItem, defaultTranslateX, scrollAreaWidth } = this.state;
    let _currentItem = currentItem;
    let _iconItemListPosLeft = defaultTranslateX;
    switch (type) {
      case 'item':
        _currentItem = index;
        break;
      case 'prev':
        _iconItemListPosLeft += this.props.leftStep;
        if (_iconItemListPosLeft <= 0) {
          this.setState({ defaultTranslateX: _iconItemListPosLeft });
        }
        break;
      case 'next':
        evt.preventDefault();
        _iconItemListPosLeft -= this.props.leftStep;
        if (Math.abs(_iconItemListPosLeft) < scrollAreaWidth) {
          this.setState({ defaultTranslateX: _iconItemListPosLeft });
        }
        break;
      default:
        break;
    }
    if (_currentItem !== this.state.currentItem) {
      this.setState({
        currentItem: _currentItem,
      });
    }
    evt.stopPropagation();
    evt.preventDefault();
    if (this.props.onClick) this.props.onClick(_currentItem);
  }
  deleteSingleClick(config, evt) {
    evt.stopPropagation();
    // evt.preventDefault();
    if (config.index || config.index === 0) {
      const { index } = config;
      if (this.props.onDelete) this.props.onDelete(index);
    }
  }
  render() {
    const itemArr = [];
    // iconItemListPos
    const { currentItem, defaultTranslateX, scrollAreaWidth } = this.state;
    const { itemData } = this.props;
    itemData.forEach((item, i) => {
      itemArr.push(<li
        key={`item_${i}`}
        className={currentItem === i ? 'upload-icon-item on' : 'upload-icon-item'}
        onClick={(evt) => this.handleClick({ type: 'item', index: i }, evt)}
      >
        <i
          className={'iconfont delete'}
          onClick={(evt) => this.deleteSingleClick({ index: i }, evt)}
        >&#xf077;</i>
        <i className={'iconfont upload-icon'}>{i}</i>
        {/*
          <Icon fill={i} />
        */}
      </li>);
    });
    return (
      <div className={'upload-icon clearfix'}>
        <button
          className={'icons-more-btn icons-more-btn-left'}
          onClick={(evt) => this.handleClick({ type: 'prev' }, evt)}
        >
          <i className={'iconfont icons-more-btn-icon'}>&#xf1c3;</i></button>
        <div className={'upload-icon-list-area'}>
          <ul
            ref={'uploadIconList'}
            className={'upload-icon-list'}
            style={{ marginLeft: defaultTranslateX, width: scrollAreaWidth }}
          >
            {itemArr}
          </ul>
        </div>
        <button
          className={'icons-more-btn icons-more-btn-right'}
          onClick={(evt) => this.handleClick({ type: 'next' }, evt)}
        >
          <i className={'iconfont icons-more-btn-icon'}>&#xf1c1;</i></button>
      </div>
    );
  }
}
