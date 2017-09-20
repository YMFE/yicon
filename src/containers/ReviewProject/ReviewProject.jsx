import './ReviewProject.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { SubTitle } from '../../components/';
import Message from '../../components/common/Message/Message';
import dialog from '../../components/common/Dialog/Confirm.jsx';
import {
  publicProjectList,
  agreePublicProject,
} from '../../actions/notification';

@connect(
  () => ({}),
  {
    publicProjectList,
    agreePublicProject,
  }
)


class ReviewProject extends Component {
  static propTypes = {
    publicProjectList: PropTypes.func,
    agreePublicProject: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      content: [],
      isShow: true,
    };
  }

  componentDidMount() {
    // 获取公共项目列表
    // 1 取未审批的
    this.getPublicProject(1);
  }

  componentWillReceiveProps() {
    this.getPublicProject(1);
  }

  setDialog(title, content, method) {
    dialog({
      title,
      content,
      onOk: () => method(),
    });
  }

  // 公开项目列表
  getPublicProject(id) {
    this.props.publicProjectList(id)
      .then(data => {
        this.setState({
          content: data.payload.data,
        });
      });
  }

  setReview(isTrue) {
    this.setState({
      isShow: isTrue,
    });
  }

  @autobind
  agreeProject(text) {
    const content = text.split('/');
    const data = {
      name: content[0],
      description: content[1],
      updateAt: content[2],
      id: content[3],
      publicId: 2,
      tabId: 2,
    };
    this.props.agreePublicProject(data)
      .then(result => {
        if (result.payload.res) {
          this.getPublicProject(1);
          this.openMessage('项目审批成功!');
        }
      });
  }

  @autobind
  cancelPublicProject(publicId, id) {
    let text = '';
    let tabId = 0;
    if (publicId === 1) {
      text = '项目拒绝成功!';
      tabId = 1;
    } else {
      text = '项目取消成功!';
    }
    const data = {
      id,
      publicId: 0,
      tabId,
    };
    this.props.agreePublicProject(data)
      .then(result => {
        if (result.payload.res) {
          // 获取项目列表
          this.getPublicProject(publicId);
          this.tabContent(publicId);
          this.openMessage(text);
        }
      });
  }

  @autobind
  tabContent(value) {
    let id = 1;
    if (+value === 1) {
      this.setReview(true);
    } else if (+value === 2) {
      this.setReview(false);
      id = 2;
    }
    this.getPublicProject(id);
  }

  // 弹层消息
  openMessage(message) {
    Message.success(message);
  }

  @autobind
  showP(e) {
    e.stopPropagation();
    const el = e.target;
    const p = el.parentNode.getElementsByTagName('p');
    if (el.offsetWidth >= 308) {
      p[0].style.display = 'block';
    }
  }

  @autobind
  hideP(e) {
    e.stopPropagation();
    const p = e.target.parentNode.getElementsByTagName('p');
    p[0].style.display = 'none';
  }

  @autobind
  showE(e) {
    e.stopPropagation();
    const el = e.target;
    el.style.display = 'block';
  }

  render() {
    const { content = [], isShow } = this.state;
    const review = isShow ? 'review' : '';
    const by = !isShow ? 'by' : '';
    const bindTabContent = value => this.tabContent(value);
    const title = '公开项目';
    const agreeContent = '同意该项目成为公开项目吗';
    const cancelContent = '拒绝该项目成为公开项目吗';
    const getDataTime = (time) => {
      let datatime = time.replace('T', ' ');
      datatime = datatime.replace(/\.[0-9A-Z]+/g, '');
      return datatime;
    };

    return (
      <section className="review-project">
        <SubTitle tit="审核项目" />
        <ul className="navs">
          <li className={review && 'active'} onClick={() => { bindTabContent(1); }}>待审核</li>
          <li className={by && 'active'} onClick={() => { bindTabContent(2); }}>已通过</li>
        </ul>
        <table className={`content ${review}`}>
          <colgroup>
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
            <col width="30%" />
            <col width="20%" />
          </colgroup>
          <tbody>
            <tr>
              <th>公开项目名称</th>
              <th>原始项目名称</th>
              <th>项目负责人</th>
              <th>申请理由</th>
              <th>申请时间</th>
              <th>操作</th>
            </tr>
            {
              content.length ? content.map((v, k) => {
                const dataContent = `${v.name}/${v.description}/${v.updateAt}/${v.id}`;
                return (
                  <tr key={k}>
                    <td title={v.publicName}><strong>{v.publicName}</strong></td>
                    <td>{v.name}</td>
                    <td>{v.projectOwner.name}</td>
                    <td>
                      <span onMouseOver={this.showP} onMouseOut={this.hideP} className="text">
                        {v.description}
                      </span>
                      <p
                        className="description"
                        onMouseOver={this.showE}
                        onMouseOut={this.hideP}
                      >
                        {v.description}
                      </p>
                      <em className="jiao"></em>
                    </td>
                    <td>{getDataTime(v.updateAt)}</td>
                    <td>
                      <button
                        onClick={
                          () => this.setDialog(
                            title, agreeContent, () => this.agreeProject(dataContent)
                          )
                        }
                        className="agree"
                      >
                        同意
                      </button>
                      <button
                        data-id={`${v.id}`}
                        onClick={
                          () => this.setDialog(
                            title, cancelContent, () => this.cancelPublicProject(1, v.id)
                          )
                        }
                        className="cancel"
                      >
                        拒绝
                      </button>
                    </td>
                  </tr>
                );
              }) : <tr><td className="no-data" colSpan="9">暂无数据</td></tr>
            }
          </tbody>
        </table>

        <table className={`content ${by}`}>
          <colgroup>
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
            <col width="30%" />
            <col width="20%" />
          </colgroup>

          <tbody>
            <tr>
              <th>公开项目名称</th>
              <th>原始项目名称</th>
              <th>项目负责人</th>
              <th>申请理由</th>
              <th>申请时间</th>
              <th>操作</th>
            </tr>
            {
              content.length ? content.map((v, k) => (
                <tr key={k}>
                  <td title={v.publicName}><strong>{v.publicName}</strong></td>
                  <td>{v.name}</td>
                  <td>{v.projectOwner.name}</td>
                  <td>
                    <span onMouseOver={this.showP} onMouseOut={this.hideP} className="text">
                      {v.description}
                    </span>
                    <p
                      className="description"
                      onMouseOver={this.showE}
                      onMouseOut={this.hideP}
                    >
                      {v.description}
                    </p>
                    <em className="jiao"></em>
                  </td>
                  <td>{getDataTime(v.updateAt)}</td>
                  <td>
                    <button
                      data-id={`${v.id}`}
                      onClick={
                        () => this.setDialog(
                          title, cancelContent, () => this.cancelPublicProject(2, v.id)
                        )
                      }
                      className="cancel"
                    >
                      取消
                    </button>
                  </td>
                </tr>
              )) : <tr><td className="no-data" colSpan="9">暂无数据</td></tr>
            }
          </tbody>
        </table>
      </section>
    );
  }
}

export default ReviewProject;
