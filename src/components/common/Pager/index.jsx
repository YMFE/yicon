/**
 * 用法 <Pager defaultCurrent={1} onClick={(index)=>{console.log(index)}} totalPage={50}/>
 */
import './Pager.scss';
import React, { Component, PropTypes } from 'react';

export default class Pager extends Component {
  static propTypes = {
    defaultCurrent: PropTypes.number,
    totalPage: PropTypes.number,
    totalCount: PropTypes.number,
    pageSize: PropTypes.number,
    onClick: PropTypes.func,
    extraClass: PropTypes.string,
  }

  static defaultProps = {
    defaultCurrent: 1,
    pageSize: 10,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: this.props.defaultCurrent,
    };
  }

  handleClick(config, evt) {
    const { type, index } = config;
    let _currentPage = this.state.currentPage;
    switch (type) {
      case 'item':
        _currentPage = index;
        break;
      case 'prev':
        if (this.state.currentPage > 1) {
          _currentPage = this.state.currentPage - 1;
        }
        break;
      case 'next':
        if (this.state.currentPage < this.props.totalPage) {
          _currentPage = this.state.currentPage + 1;
        }
        break;
      case 'prev-jump':
        if (this.state.currentPage - 5 >= 1) {
          _currentPage = this.state.currentPage - 5;
        }
        break;
      case 'next-jump':
        if (this.state.currentPage + 5 <= this.props.totalPage) {
          _currentPage = this.state.currentPage + 5;
        }
        break;
      default:
        break;
    }

    if (_currentPage !== this.state.currentPage) {
      this.setState({
        currentPage: _currentPage,
      });
    }

    evt.stopPropagation();
    evt.preventDefault();

    if (this.props.onClick) this.props.onClick(_currentPage);
  }

  render() {
    let content = [];
    const { currentPage } = this.state;
    const { totalCount, pageSize } = this.props;
    let { totalPage } = this.props;

    if (!totalPage && totalCount) {
      totalPage = Math.ceil(totalCount / pageSize);
    }

    // 上一页
    content.push(<li
      key="prev"
      className={currentPage === 1 ? 'pager-prev disabled' : 'pager-prev'}
      onClick={(evt) => this.handleClick({ type: 'prev' }, evt)}
    ><a>上一页</a>
    </li>);

    for (let i = 1; i <= totalPage; i++) {
      if (i !== 1 && i !== totalPage && Math.abs(currentPage - i) > 2) {
        // 最前和最后一定要显示
        if (i === 2 && Math.abs(currentPage - i) > 2) {
                // 左边的点点点
          content.push(<li
            key="prev-jump"
            className="pager-jump"
            onClick={(evt) => this.handleClick({ type: 'prev-jump' }, evt)}
          ><a>...</a>
          </li>);
        }
        if (i === totalPage - 1 && Math.abs(currentPage - i) > 2) {
              // 右边的点点点
          content.push(<li
            key="next-jump"
            className="pager-jump"
            onClick={(evt) => this.handleClick({ type: 'next-jump' }, evt)}
          ><a>...</a>
          </li>);
        }
      } else {
        content.push(<li
          key={`item_${i}`}
          className={currentPage === i ? 'pager-item actived' : 'pager-item'}
          onClick={(evt) => this.handleClick({ type: 'item', index: i }, evt)}
        ><a>{i}</a>
        </li>);
      }
    }

    // 下一页
    content.push(<li
      key="next"
      className={currentPage === totalPage ? 'pager-next disabled' : 'pager-next'}
      onClick={(evt) => this.handleClick({ type: 'next' }, evt)}
    ><a>下一页</a>
    </li>);
    return (
      <ul className={this.props.extraClass ? `pager ${this.props.extraClass}` : 'pager'}>
            {content}
      </ul>
  );
  }
}
