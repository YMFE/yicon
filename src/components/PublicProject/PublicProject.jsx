import './PublicProject.scss';
import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Dialog from '../../components/common/Dialog/Index';

class PublicProject extends Component {
  static propTypes = {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    title: PropTypes.string,
    visible: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      reason: '',
      isShowError: false,
      inputValue: '',
      publicName: '',
    };
  }

  componentWillReceiveProps() {
    this.getInputValue();
  }

  getInputValue() {
    const parent = document.querySelector('.global-content-menu');
    const list = parent.getElementsByTagName('li');
    const leng = list.length;
    for (let i = 0; i < leng; i++) {
      if (list[i].className.indexOf('selected') !== -1) {
        this.setState({
          name: list[i].getElementsByTagName('a')[0].innerHTML,
        });
      }
    }
  }

  @autobind
  getValue() {
    const { name, reason, publicName } = this.state;
    this.verification(name, reason);
    return {
      name,
      reason,
      publicName,
    };
  }

  @autobind
  getProjectName(e) {
    this.setValue('publicName', e.target.value);
  }

  @autobind
  getProjectReason(e) {
    this.setValue('reason', e.target.value);
  }

  setInputValue(inputValue) {
    this.setValue('inputValue', inputValue);
  }

  setError(isTrue) {
    this.setValue('isShowError', isTrue);
  }

  setValue(key, value) {
    this.setState({
      [key]: value,
    });
  }

  @autobind
  verification(...value) {
    const [publicName, reason] = value;
    if (publicName && reason) {
      return false;
    }
    if (!publicName) {
      this.setInputValue('项目名称不能为空');
    } else if (!reason) {
      this.setInputValue('申请理由不能为空');
    }
    this.setError(false);
    return true;
  }

  clearValue() {
    this.setValue('reason', '');
    this.setValue('inputValue', '');
    this.setValue('publicName', '');
  }

  render() {
    const { title, visible, onOk, onCancel } = this.props;
    const { isShowError } = this.state;
    const isBlock = !isShowError ? 'is-block' : '';
    const { inputValue, reason, publicName } = this.state;
    const submitForm = () => {
      const value = this.getValue();
      if (value.name && value.reason) {
        this.clearValue();
        onOk(false, this.getValue());
      }
    };

    return (
      <Dialog
        title={title}
        extraClass="project-dialog"
        onOk={() => { submitForm(); }}
        onCancel={() => { onCancel(); }}
        visible={visible}
      >
        <div className="public-project">
          <article>
            <label htmlFor="project-name">项目名称</label>
            <input
              type="text"
              id="project-name"
              placeholder="请填写申请公开项目的项目名称"
              onInput={this.getProjectName}
              value={publicName}
              maxLength="100"
            />
          </article>
          <article>
            <label htmlFor="reason">申请理由</label>
            <textarea
              id="textarea"
              placeholder="申请公开项目的理由"
              onInput={this.getProjectReason}
              value={reason}
              maxLength="500"
            >
            </textarea>
          </article>
          <p className={`error ${isBlock}`}>{inputValue}</p>
        </div>
      </Dialog>
    );
  }
}

export default PublicProject;
