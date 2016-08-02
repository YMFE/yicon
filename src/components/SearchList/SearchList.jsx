
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
    onChange: PropTypes.func,
    onChoseMember: PropTypes.func,
    showSearchList: PropTypes.bool,
  }
  static defaultProps = {
    noFoundTip: '没有符合的结果',
  }
  constructor(props) {
    super(props);
    this.state = {
      writeState: WRITE_STATE.EMPTY,
      input: '',
      showSuggest: false,
    };
    this.inputLocation = {
      top: 0,
      left: 0,
      height: 0,
    };
  }
  componentDidMount() {
    this.wrapper = document.createElement('div');
    document.body.appendChild(this.wrapper);
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
    });
  }

  @autobind
  addNewMember() {
    const suggestList = this.props.suggestList;
    if (suggestList && suggestList.length === 0) {
      return;
    }
    suggestList.some((item) => {
      if (item.name === this.state.input) {
        this.props.onChoseMember(item);
        return true;
      }
      return false;
    });
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

  renderSuggestList() {
    return (
      <SuggestList
        {...this.props}
        writeState={this.state.writeState}
        show={this.state.showSuggest && this.props.showSearchList}
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
    return (
      <li className="field">
        <label
          className="field-set SuggestList"
        >
          <input
            type="text"
            name="project-collaborators"
            className="project-collaborators"
            placeholder="请输入需要添加成员域账号"
            onChange={this.onChange}
            onBlur={this.onBlur}
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
        <div className="field-btn">
          <div type="button" className="add-collaborators" onClick={this.addNewMember}>
            添加新成员
          </div>
        </div>
      </li>
    );
  }
}
export default SearchList;
