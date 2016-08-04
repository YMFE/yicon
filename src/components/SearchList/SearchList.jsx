
import './SearchList.scss';
import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import SuggestList from './SuggestList.jsx';

const WRITE_STATE = {
  EMPTY: Symbol(0),
  NOT_FOUND: Symbol(1),
  HAS_RESULT: Symbol(2),
};

class SearchList extends Component {
  static propTypes = {
    suggestList: PropTypes.array,
    noFoundTip: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onChoseItem: PropTypes.func,
    onChoseError: PropTypes.func,
    showSearchList: PropTypes.bool,
    extraClass: PropTypes.string,
    children: PropTypes.element,
  }
  static defaultProps = {
    noFoundTip: '没有符合的结果',
    placeholder: '请输入成员名称',
  }
  constructor(props) {
    super(props);
    this.state = {
      writeState: WRITE_STATE.EMPTY,
      input: '',
      isFocus: false,
      showSuggest: false,
    };
    this.inputLocation = {
      top: 0,
      left: 0,
      height: 38,
    };
  }
  componentDidMount() {
    document.onresize = () => {
      this.onShow();
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestList.length > 0) {
      if (nextProps.suggestList.length === 1 &&
        nextProps.suggestList[0].name === this.state.input) {
        this.setState({
          writeState: WRITE_STATE.HAS_RESULT,
          showSuggest: false,
        });
        return;
      }
      this.setState({
        writeState: WRITE_STATE.HAS_RESULT,
        showSuggest: true,
      });
      return;
    }
    if (this.state.input.length !== 0) {
      this.setState({
        writeState: WRITE_STATE.NOT_FOUND,
        showSuggest: true,
      });
      return;
    }
    if (this.state.input.length === 0) {
      this.setState({
        writeState: WRITE_STATE.EMPTY,
        showSuggest: false,
      });
    }
  }
  onShow() {
    if (this.inputEle) {
      this.inputLocation = this.inputEle.getBoundingClientRect();
    }
  }

  @autobind
  onChange(e) {
    const value = e.target ? e.target.value : e;
    if (value.length === 0) this.setState({ writeState: WRITE_STATE.EMPTY });
    this.props.onChange(value);
    this.setState({
      input: value,
    });
  }

  @autobind
  onBlur(e) {
    if (e.target.nodeName === 'LI') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.setState({
      showSuggest: false,
      isFocus: false,
    });
  }
  @autobind
  onFocus() {
    this.setState({
      isFocus: true,
    });
  }
  @autobind
  checkValue() {
    const suggestList = this.props.suggestList;
    if (suggestList && suggestList.length === 0) {
      this.props.onChoseError();
      return false;
    }
    const result = suggestList.some((item) => {
      if (item.name === this.state.input) {
        this.props.onChoseItem(item);
        return true;
      }
      return false;
    });
    if (!result) this.props.onChoseError();
    return false;
  }

  @autobind
  choseItemfromSuggest(e) {
    let index;
    if (e) {
      index = parseInt(e.target.dataset.index, 10);
    } else if (typeof this.state.activeIndex === 'number') {
      index = this.state.activeIndex;
    }
    const target = this.props.suggestList[index];
    this.setState({
      valueItem: target,
      input: target.name,
      lawfunlInput: true,
    });
    this.props.onChange(target.name);
  }
  @autobind
  handleKeyDown(e) {
    let activeIndex = this.state.activeIndex;
    if (e.keyCode === 38) {
      if (typeof activeIndex === 'number') {
        activeIndex = activeIndex > 0 ?
          activeIndex - 1 :
          activeIndex;
      } else {
        activeIndex = this.props.suggestList.length - 1;
      }
      this.setState({
        activeIndex,
      });
    } else if (e.keyCode === 40) {
      if (typeof activeIndex === 'number') {
        activeIndex = activeIndex < this.props.suggestList.length - 1 ?
          activeIndex + 1 :
          activeIndex;
      } else {
        activeIndex = 0;
      }
      this.setState({
        activeIndex,
      });
    } else if (e.keyCode === 13) {
      e.stopPropagation();
      e.preventDefault();
      this.choseItemfromSuggest(null);
    }
  }

  clearInput() {
    this.setState({
      input: '',
      writeState: WRITE_STATE.EMPTY,
      showSuggest: false,
    });
    this.props.onChange('');
  }

  renderSuggestList() {
    const {
      height,
    } = this.inputLocation;
    // console.log(top,left);
    return (
      <SuggestList
        {...this.props}
        top={height}
        writeState={this.state.writeState}
        show={this.state.showSuggest && this.props.showSearchList && this.state.isFocus}
        WRITE_STATE={WRITE_STATE}
        onChoseItem={(e) => {
          this.choseItemfromSuggest(e);
        }}
        activeIndex={this.state.activeIndex}
        ref={(node) => {
          if (node) {
            this.suggestListEle = node;
          }
        }}
      />
    );
  }

  render() {
    const { writeState } = this.state;
    const classList = ['field-set', 'SuggestList'];
    classList.push(this.props.extraClass);
    return (
      <li className="field SearchList">
        <label
          className={classList.join(' ')}
        >
          <input
            type="text"
            name="project-collaborators"
            className="SearchList-input project-collaborators"
            placeholder={this.props.placeholder}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            value={this.state.input}
            autoComplete="off"
            onKeyDown={this.handleKeyDown}
            style={{
              zIndex: 1,
              position: 'relative',
            }}
            ref={(node) => {
              this.inputEle = node;
            }}
          />
          {
            writeState !== WRITE_STATE.EMPTY
            ? this.renderSuggestList()
            : null
        }
        </label>
        {this.props.children}
      </li>
    );
  }
}
export default SearchList;
