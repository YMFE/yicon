import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Menu, Main } from '../../components/';
import Dialog from '../../components/common/Dialog/Index';
import Message from '../../components/common/Message/Message';
import confirm from '../../components/common/Dialog/Confirm.jsx';
import Loading from '../../components/common/Loading/Loading.jsx';

import {
  fetchDisabledCode,
  setDisabledCode,
  unsetDisabledCode,
  updateDisabledCode,
} from '../../actions/admin';

import './DisabledCode.scss';

@connect(
  state => ({
    disabledCode: state.user.admin.disabledCode,
  }), {
    fetchDisabledCode,
    setDisabledCode,
    unsetDisabledCode,
    updateDisabledCode,
  }
)

export default class DisabledCode extends Component {

  static propTypes = {
    fetchDisabledCode: PropTypes.func,
    setDisabledCode: PropTypes.func,
    unsetDisabledCode: PropTypes.func,
    updateDisabledCode: PropTypes.func,
    disabledCode: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      codeId: 0,
      code: '',
      mobile: '',
      os: '',
      other: '',
      isShowLoading: false,
    };
  }

  componentWillMount() {
    this.props.fetchDisabledCode();
  }

  /* 问题编码 */
  @autobind
  showDisabledCodeItem(item, index) {
    return (
      <li
        data-id={item.id}
        data-code={item.code}
        key={index}
        title="编辑信息"
        onClick={this.updateCodeDescription}
      >
        {`&#x${item.code.toString(16)};`}
        {/* {`${item.code.toString(16).toUpperCase()}`} */}
        <i
          className="iconfont pointer"
          title="删除编码"
          data-id={item.id}
          onClick={this.removeDisabledCode}
        >&#xf077;</i>
      </li>
    );
  }

  @autobind
  addDisabledCodeDialog() {
    this.setState({
      disabledCodeVisible: true,
      code: '',
      mobile: '',
      os: '',
      other: '',
      isUpdateCode: false,
    });
  }

  @autobind
  closeDisabledCodeDialog() {
    this.setState({
      disabledCodeVisible: false,
    });
  }

  @autobind
  handleDisabledCodeChange(evt) {
    switch (evt.target.dataset.type) {
      case 'code': {
        this.setState({
          code: evt.target.value,
        });
        break;
      }
      case 'mobile': {
        this.setState({
          mobile: evt.target.value,
        });
        break;
      }
      case 'os': {
        this.setState({
          os: evt.target.value,
        });
        break;
      }
      case 'other': {
        this.setState({
          other: evt.target.value,
        });
        break;
      }
      default:
        return;
    }
  }

  @autobind
  ensureAddDisabledCode() {
    const { code, mobile, os, other } = this.state;
    if (!code.trim()) {
      Message.error('编码不能为空');
      return;
    }
    if (!/^[E|F][0-8][A-F0-9]{2}$/ig.test(code)) {
      Message.error('编码输入格式错误，请检查');
      return;
    }
    if (!mobile.trim() || !os.trim()) {
      Message.error('机型和系统等信息不能为空');
      return;
    }
    if (mobile.length >= 100) {
      Message.error('机型信息字段过长，请删减');
      return;
    }
    if (os.length >= 100) {
      Message.error('系统信息字段过长，请删减');
      return;
    }
    if (other.length >= 2000) {
      Message.error('其他信息字段过长，请删减');
      return;
    }
    this.props.setDisabledCode({ codes: [{
      code: `0x${code.toLowerCase()}`,
      description: JSON.stringify({
        mobile,
        os,
        other: other || '无',
      }),
    }] });
    this.closeDisabledCodeDialog();
  }

  @autobind
  syncDisabledCode() {
    this.setState({ isShowLoading: true });
    let isTimeout = false;
    const timeout = setTimeout(() => {
      Message.error('请求 Github 仓库数据超时，请稍后再试');
      isTimeout = true;
      this.setState({ isShowLoading: false });
    }, 8000);
    axios.get('/api/admin/disabledCode/github')
      .then(res => {
        if (isTimeout) {
          isTimeout = false;
          return;
        }
        clearTimeout(timeout);
        const { content } = res && res.data && res.data.data;
        const data = content.length ? content.map((item, key) => (<li
          className="item-code"
          key={key}
        >
          {item.code && item.code.replace('0x', '')}
        </li>))
        : (<li>暂无同步的编码</li>);
        const element = (<div className="sync-disabled-code">
          <h5>是否同步下列编码：</h5>
          <ul className="code-wrapper">{data}</ul>
        </div>);
        confirm({
          title: '同步系统占用编码',
          content: element,
          onOk: () => {
            this.props.setDisabledCode({ codes: content });
          },
        });
        this.setState({ isShowLoading: false });
      })
      .catch(() => {
        Message.error('请求数据出错啦，请稍后再试');
        this.setState({ isShowLoading: false });
      });
  }

  @autobind
  updateCodeDescription(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    axios.get(`/api/icons/${id}`).then(res => {
      const { code, description } = res && res.data && res.data.data;
      const { mobile, os, other } = JSON.parse(description);
      this.setState({
        disabledCodeVisible: true,
        codeId: id,
        code: code.toString(16).toUpperCase(),
        mobile,
        os,
        other,
        isUpdateCode: true,
      });
    }).catch(() => {
      Message.error('请求出错啦，请稍后再试');
    });
  }

  @autobind
  ensureUpdateDisabledCode() {
    const { codeId, mobile, os, other } = this.state;
    if (!mobile.trim() || !os.trim()) {
      Message.error('机型和系统等信息不能为空');
      return;
    }
    if (mobile.length >= 100) {
      Message.error('机型信息字段过长，请删减');
      return;
    }
    if (os.length >= 100) {
      Message.error('系统信息字段过长，请删减');
      return;
    }
    if (other.length >= 2000) {
      Message.error('其他信息字段过长，请删减');
      return;
    }
    const description = JSON.stringify({
      mobile,
      os,
      other: other || '无',
    });
    this.props.updateDisabledCode({
      iconId: codeId,
      description,
    });
    this.closeDisabledCodeDialog();
  }

  @autobind
  removeDisabledCode(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    confirm({
      content: '是否确定解除禁用系统占用编码，请慎重操作！',
      title: '解除禁用',
      onOk: () => {
        this.props.unsetDisabledCode(id);
      },
      onCancel: () => {},
    });
    e.stopPropagation();
    return false;
  }

  render() {
    return (
      <div className="yicon-main yicon-myicon yicon-code">
        <div>
          <SubTitle tit={'编码管理'} />
          <Content>
            <Menu>
              <li className="selected">
                <Link to="/admin/disabledCode">系统占用编码</Link>
              </li>
            </Menu>
            <Main extraClass="yicon-myicon-main">
              <div
                className="myicon-prj-right disabled-code"
              >
                <div className="myicon-prj-info">
                  <div className="prj-details">
                    <div className="title">
                      <h3>系统占用编码名单</h3>
                    </div>
                  </div>
                  <div className="add-disabled-code">
                    <menu className="options" style={{ paddingLeft: 0 }}>
                      <span
                        className="disabled-code-operation add-code"
                        onClick={this.addDisabledCodeDialog}
                      >添加编码</span>
                      <span
                        className="disabled-code-operation get-code"
                        onClick={this.syncDisabledCode}
                      >同步编码</span>
                    </menu>
                  </div>
                </div>
                <div className="clearfix collaborators">
                  <p className="collaborators-title">系统占用编码列表</p>
                  <ul className="collaborators-list">
                    {
                      this.props.disabledCode.length > 0 ?
                      this.props.disabledCode.map((item, index) =>
                        this.showDisabledCodeItem(item, index)
                      )
                      : (<li>没有数据</li>)
                    }
                  </ul>
                </div>
              </div>
            </Main>
          </Content>
          <Dialog
            visible={this.state.disabledCodeVisible}
            title={`${this.state.isUpdateCode ? '编辑' : '添加'}系统占用编码`}
            onOk={this.state.isUpdateCode
              ? this.ensureUpdateDisabledCode
              : this.ensureAddDisabledCode}
            onCancel={this.closeDisabledCodeDialog}
          >
            <div className="code-dialog" onChange={this.handleDisabledCodeChange}>
              <ul>
                <li className="dialog-item">
                  <div className="item-name">编码</div>
                  <div className="dialog-input">
                    <input
                      type="text"
                      value={this.state.code}
                      data-type="code"
                      placeholder={'请输入编码(E000 - F8FF)，不区分大小写'}
                      disabled={this.state.isUpdateCode}
                    />
                  </div>
                </li>
                <li className="dialog-item">
                  <div className="item-name">机型</div>
                  <div className="dialog-input">
                    <input
                      placeholder="请输入存在问题的机型"
                      value={this.state.mobile}
                      data-type="mobile"
                    />
                  </div>
                </li>
                <li className="dialog-item">
                  <div className="item-name">系统</div>
                  <div className="dialog-input">
                    <input
                      placeholder="请输入存在问题的系统"
                      value={this.state.os}
                      data-type="os"
                    />
                  </div>
                </li>
                <li className="dialog-item">
                  <div className="item-name">其他</div>
                  <div className="dialog-input">
                    <textarea
                      className="description-textarea"
                      placeholder="其他信息"
                      value={this.state.other}
                      data-type="other"
                    ></textarea>
                  </div>
                </li>
              </ul>
            </div>
          </Dialog>
          <Loading visible={this.state.isShowLoading} />
        </div>
      </div>
    );
  }
}
