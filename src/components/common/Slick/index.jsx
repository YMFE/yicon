import './Slick.scss';
import React, { Component, PropTypes } from 'react';

const itemData = [
  {
    name: '笔',
    tags: '你好,呵呵',
    code: 61442,
  },
  {
    name: '笔',
    tags: '你好,呵呵',
    code: 61442,
  }];
export default class Slick extends Component {
  static defaultProps = {
    directionNav: true,
  }
  static propTypes = {
    defaultCurrent: PropTypes.number,
    directionNav: PropTypes.bool,
    onSelect: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      currentItem: this.props.defaultCurrent,
    };
  }
  handleClick(config, evt) {
    const { type, index } = config;
    // let _currentPage = this.state.currentPage;
    switch (type) {
      case 'item':
        // if (this.state.currentPage > 1) {
        //   _currentPage = this.state.currentPage - 1;
        // }
        console.log(index);
        console.log('item 点击');
        break;
      case 'prev':
        // if (this.state.currentPage > 1) {
        //   _currentPage = this.state.currentPage - 1;
        // }
        console.log('上一页');
        break;
      case 'next':
        // if (this.state.currentPage < this.props.totalPage) {
        //   _currentPage = this.state.currentPage + 1;
        // }
        console.log('下一页');
        break;
      default:
        break;
    }

    // if (_currentPage !== this.state.currentPage) {
    //   this.setState({
    //     currentPage: _currentPage,
    //   });
    // }

    evt.stopPropagation();
    evt.preventDefault();

  //  if (this.props.onClick) this.props.onClick(_currentPage);
  }
  deleteSingleClick(config, evt) {
    const { index } = config;
    console.log(index);
    console.log(evt);
    alert('delete');
  }
  render() {
    const itemArr = [];
    itemData.forEach((item, i) => {
      console.log(item);
      console.log(i);
      itemArr.push(<li
        className={'upload-icon-item'}
        onClick={(evt) => this.handleClick({ type: 'item', index: i }, evt)}
      >
        <i
          className={'iconfont delete'}
          onClick={(evt) => this.deleteSingleClick({ index: i }, evt)}
        >&#xf077;</i>
        <i className={'iconfont upload-icon'}>&#xf50f;</i>
      </li>);
    });
    return (
      <div className={'upload-icon clearfix'}>
        <button
          className={'icons-more-btn icons-more-btn-left'}
          onClick={(evt) => this.handleClick({ type: 'prev' }, evt)}
        >
          <i className={'iconfont icons-more-btn-icon'}>&#xf1c3;</i></button>
        <ul className={'upload-icon-list'}>
          {itemArr}
        </ul>
        <button className={'icons-more-btn icons-more-btn-right'}>
          <i className={'iconfont icons-more-btn-icon'}>&#xf1c1;</i></button>
      </div>
    );
  }
}
