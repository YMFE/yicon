
import './SearchList.scss';
import ReactDOM from 'react-dom';
import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';

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
    if (this.suggestListEle) {
      this.suggestListEle.forceUpdate();
    } else {
      this.renderSuggestList();
    }
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
    if (this.suggestListEle) { this.suggestListEle.forceUpdate(); }
  }
  onShow() {
    if (this.inputEle) {
      this.inputLocation = this.inputEle.getBoundingClientRect();
      if (this.suggestListEle) {
        this.suggestListEle.forceUpdate();
      } else {
        this.renderSuggestList();
      }
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
  onBlur() {
    this.setState({
      showSuggest: false,
    });
  }

  @autobind
  addNewMember() {
    const suggestList = this.props.suggestList;
    // console.log(suggestList);
    if (suggestList && suggestList.length === 0) {
      return;
    }
    suggestList.some((item) => {
      if (item.name === this.state.input) {
        console.log('trigger onChoseMember');
        this.props.onChoseMember(item);
        return true;
      }
      return false;
    });
  }

  @autobind
  choseItemfromSuggest(e) {
    // console.log(`index:${e.target.dataset.index}`);
    let index;
    if (e) {
      index = parseInt(e.target.dataset.index, 10);
    } else if (typeof this.state.activeIndex === 'number') {
      index = this.state.activeIndex;
    }
    const target = this.props.suggestList[index];
    console.log(`target:${target}`);
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
    // console.log(e.keyCode);
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
    // console.log(this.state.activeIndex);
  }
  renderSuggestList() {
    this.inputLocation = this.inputEle.getBoundingClientRect();
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      <SuggestList
        {...this.props}
        writeState={this.state.writeState}
        show={this.state.showSuggest && this.props.showSearchList}
        top={this.inputLocation.top + this.inputLocation.height}
        onChoseItem={(e) => {
          console.log('123456');
          this.choseItemfromSuggest(e);
        }}
        activeIndex={this.state.activeIndex}
        left={this.inputLocation.left}
        ref={(node) => {
          if (node) {
            this.suggestListEle = node;
          }
        }}
      />,
      this.wrapper
    );
  }


  render() {
    const { writeState } = this.state;
    return (
      <li className="field">
        <div
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
        </div>
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

const SuggestList = (props) => {
  const {
    writeState,
    suggestList,
    noFoundTip,
    show,
    top,
    left,
  } = props;
  return (
    <ul
      className="SuggestList-list"
      style={{
        display: show ? 'block' : 'none',
        top,
        left,
      }}
    >
    {
      writeState === WRITE_STATE.HAS_RESULT
      ?
        suggestList.map((item, index) => (
          <li
            className={index === props.activeIndex ? 'active' : ''}
            key={index}
            data-index={index}
            data-id={item.id}
            onClick={(e) => {
              console.log('trigger click');
              props.onChoseItem(e);
            }}
          >{item.name}
          </li>
        ))
      :
        <li>{noFoundTip}</li>
    }
    </ul>
  );
};

SuggestList.propTypes = {
  writeState: PropTypes.symbol,
  suggestList: PropTypes.array,
  noFoundTip: PropTypes.string,
  onChoseItem: PropTypes.func,
  onChoseMember: PropTypes.func,
  show: PropTypes.bool,
  top: PropTypes.number,
  left: PropTypes.number,
  activeIndex: PropTypes.number,
};
