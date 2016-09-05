import './Slick.scss';
import React, { Component, PropTypes } from 'react';
import Icon from '../Icon/Icon.jsx';
// import Icon from '../Icon/Icon.jsx';
export default class Slick extends Component {

  static defaultProps = {
    defaultTranslateX: 0,
    step: 84 * 12,
    doneArr: [],
  }

  static propTypes = {
    currentItem: PropTypes.number,
    defaultCurrent: PropTypes.number,
    defaultTranslateX: PropTypes.number,
    directionNav: PropTypes.bool,
    onClick: PropTypes.func,
    onDelete: PropTypes.func,
    // iconItemListPos: PropTypes.object,
    step: PropTypes.number,
    itemData: PropTypes.array,
    doneArr: PropTypes.array,
    noRemoveIcon: PropTypes.bool,
  }

  state = {
    currentItem: this.props.defaultCurrent,
    defaultTranslateX: this.props.defaultTranslateX,
    step: this.props.step,
  // iconItemListPos: Object.assign({}, this.props.iconItemListPos),
    scrollAreaWidth: 0,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultCurrent || nextProps.defaultCurrent === 0) {
      const currentItem = nextProps.defaultCurrent;
      this.setState({
        currentItem,
      });
      const itemPage = parseInt(currentItem / 12, 10);
      // 暂时针对 只需step = 84 * 12的处理，step为其他值组件需要重新考虑
      const currPage = parseInt(this.state.defaultTranslateX / this.props.step, 10);
      if (itemPage !== currPage) {
        this.setState({
          defaultTranslateX: -(itemPage * this.props.step),
        });
      }
    }
  }
  // componentWillMount() {
  //   const { itemData } = this.props;
  //   const uiWidth = 84 * itemData.length;
  //   this.setState({ scrollAreaWidth: uiWidth });
  // }
  handleClick(config, evt) {
    const { type, index } = config;
    const { itemData } = this.props;
    const scrollAreaWidth = 84 * itemData.length;
    const { currentItem, defaultTranslateX } = this.state;
    const { step } = this.props;
    const uploadIconListArea = 1008;
    let _currentItem = currentItem;
    let _iconItemListPosLeft = defaultTranslateX;
    switch (type) {
      case 'item':
        _currentItem = index;
        break;
      case 'prev':
        _iconItemListPosLeft += step;
        if (_iconItemListPosLeft <= 0) {
          this.setState({ defaultTranslateX: _iconItemListPosLeft });
        }
        break;
      case 'next':
        evt.preventDefault();
        _iconItemListPosLeft -= step;
        // 单步滚动
        if (step < uploadIconListArea) {
          const scrollPage = Math.floor(scrollAreaWidth / uploadIconListArea);
          const leftLength = scrollAreaWidth % uploadIconListArea;
          if (leftLength !== 0) {
            if (scrollPage > 0) {
              if (Math.abs(_iconItemListPosLeft) <= leftLength) {
                this.setState({ defaultTranslateX: _iconItemListPosLeft });
              } else {
                const leftScroll = (scrollAreaWidth - uploadIconListArea);
                if (Math.abs(_iconItemListPosLeft) < leftScroll) {
                  this.setState({ defaultTranslateX: _iconItemListPosLeft });
                }
              }
            }
          } else {
            if (scrollPage > 1) {
              const leftScroll = (scrollAreaWidth - uploadIconListArea);
              if (Math.abs(_iconItemListPosLeft) < leftScroll) {
                this.setState({ defaultTranslateX: _iconItemListPosLeft });
              }
            }
          }
        } else {
          if (Math.abs(_iconItemListPosLeft) < scrollAreaWidth) {
            this.setState({ defaultTranslateX: _iconItemListPosLeft });
          }
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
    const { itemData, noRemoveIcon, doneArr } = this.props;
    const scrollAreaWidth = 84 * itemData.length;
    const { currentItem, defaultTranslateX } = this.state;
    // const { itemData } = this.props;
    itemData.forEach((item, i) => {
      const onClass = currentItem === i ? 'on' : '';
      const doneClass = doneArr.indexOf(item) !== -1 ? 'done' : '';
      itemArr.push(<li
        key={`item_${i}`}
        className={`upload-icon-item ${onClass} ${doneClass}`}
        onClick={(evt) => this.handleClick({ type: 'item', index: i }, evt)}
      >
        {noRemoveIcon ||
          <i
            className="iconfont delete"
            onClick={(evt) => this.deleteSingleClick({ index: i }, evt)}
          >&#xf077;</i>
        }
        <Icon
          className={'iconfont upload-icon'}
          d={item.path}
          size={60}
          fill={currentItem === i ? '#008ed6' : '#555f6e'}
        />
        <div className={`pass-tag ${item.passed ? '' : 'hide'}`}>通过</div>
        <div className={`no-pass-tag ${item.passed === false ? '' : 'hide'}`}>不通过</div>
      </li>);
    });
    return (
      <div className="upload-icon clearfix">
        <button
          className="icons-more-btn icons-more-btn-left"
          onClick={(evt) => this.handleClick({ type: 'prev' }, evt)}
        >
          <i className="iconfont icons-more-btn-icon">&#xf1c3;</i></button>
        <div className="upload-icon-list-area" ref="uploadIconListArea">
          <ul
            ref="uploadIconList"
            className="upload-icon-list"
            style={{ marginLeft: defaultTranslateX, width: scrollAreaWidth }}
          >
            {itemArr}
          </ul>
        </div>
        <button
          className="icons-more-btn icons-more-btn-right"
          onClick={(evt) => this.handleClick({ type: 'next' }, evt)}
        >
          <i className="iconfont icons-more-btn-icon">&#xf1c1;</i></button>
      </div>
    );
  }
}
