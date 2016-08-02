import './Slick.scss';
import React, { Component, PropTypes } from 'react';
const itemData = [];
for (let i = 0; i < 28; i++) {
  const obj = {
    index: i,
    name: '笔',
    tags: '你好,呵呵',
    code: 61442,
  };
  itemData.push(obj);
}
// const itemData = [
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   },
//   {
//     name: '笔',
//     tags: '你好,呵呵',
//     code: 61442,
//   }];

// itemDate 为icon数据 存入state中 方便操作删除当前后 重新渲染
export default class Slick extends Component {
  static defaultProps = {
    currentItem: 0,
    directionNav: true,
    defaultTranslateX: 0,
  //  itemData: [],
    iconItemListPos: {
      transform: 'translateX(0)',
    },
    // leftStep: 84 * 12,
    leftStep: 1008,
  }
  static propTypes = {
    currentItem: PropTypes.number,
    defaultCurrent: PropTypes.number,
    defaultTranslateX: PropTypes.number,
    // itemData: PropTypes.array,
    directionNav: PropTypes.bool,
    onSelect: PropTypes.func,
    iconItemListPos: PropTypes.object,
    leftStep: PropTypes.number,
  }
  constructor(props) {
    super(props);
    this.state = {
      currentItem: this.props.defaultCurrent,
      defaultTranslateX: this.props.defaultTranslateX,
      iconItemListPos: Object.assign({}, this.props.iconItemListPos),
      scrollAreaWidth: 0,
    //  itemData: this.props.itemData,
    };
  }
  componentWillMount() {
    const uiWidth = 84 * itemData.length;
    // 删除的时候 需要重新渲染 itemData: itemData,
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
        console.log('上一页');
        _iconItemListPosLeft += this.props.leftStep;
        if (_iconItemListPosLeft <= 0) {
          this.setState({ defaultTranslateX: _iconItemListPosLeft });
        }
        console.log(_iconItemListPosLeft);
        // this.setState({ iconItemListPos: {
        //   transform: `translateX(${_iconItemListPosLeft}px)`,
        // } });
        break;
      case 'next':
        // if (this.state.currentPage < this.props.totalPage) {
        //   _currentPage = this.state.currentPage + 1;
        // }
        evt.preventDefault();
        console.log('下一页');
        _iconItemListPosLeft -= this.props.leftStep;
        console.log(scrollAreaWidth);
        if (Math.abs(_iconItemListPosLeft) < scrollAreaWidth) {
          this.setState({ defaultTranslateX: _iconItemListPosLeft });
        }

        // this.setState({ defaultTranslateX: _iconItemListPosLeft });
        // this.setState({ iconItemListPos: {
        //   transform: `translateX(${_iconItemListPosLeft}px)`,
        // } });
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

  //  if (this.props.onClick) this.props.onClick(_currentPage);
  }
  deleteSingleClick(config, evt) {
    evt.stopPropagation();
    evt.preventDefault();
    const { index } = config;
    console.log(index);
    console.log(evt);
    alert('delete');
    // 重新计算滚动ul 宽
  }
  render() {
    const itemArr = [];
    // iconItemListPos
    const { currentItem, defaultTranslateX, scrollAreaWidth } = this.state;
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
        {/* &#xf50f; {`&#${item.code};`} */}
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
