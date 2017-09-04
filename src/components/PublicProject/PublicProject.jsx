import './PublicProject.scss';
import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Dialog from '../../components/common/Dialog/Index';

class PublicProject extends Component {
  static propTypes = {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    title: PropTypes.string,
    visible: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      reason: '',
      isShowError: false,
      inputValue: '',
    };
  }

  @autobind
  getValue() {
    const { name, reason } = this.state;
    this.verification(name, reason);
    return {
      name,
      reason,
    };
  }

  @autobind
  getProjectName(e) {
    this.setValue('name', e.target.value);
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
    const [name, reason] = value;
    if (name && reason) {
      return false;
    }
    if (!name) {
      this.setInputValue('项目名称不能为空');
    } else if (!reason) {
      this.setInputValue('申请理由不能为空');
    }
    this.setError(false);
    return true;
  }

  clearValue() {
    this.setValue('reason', '');
    this.setValue('name', '');
    this.setValue('inputValue', '');
  }

  render() {
    const { title, visible, onOk, onCancel } = this.props;
    const { isShowError } = this.state;
    const isBlock = !isShowError ? 'is-block' : '';
    const { inputValue, name, reason } = this.state;
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
              value={name}
            />
          </article>
          <article>
            <label htmlFor="reason">申请理由</label>
            <textarea
              id="textarea"
              placeholder="申请公开项目的理由"
              onInput={this.getProjectReason}
              value={reason}
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
