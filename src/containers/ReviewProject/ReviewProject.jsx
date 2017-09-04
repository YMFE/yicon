import './ReviewProject.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { SubTitle } from '../../components/';
import Message from '../../components/common/Message/Message';
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
    this.getPublicProject(1);
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
  agreeProject(e) {
    const content = e.target.getAttribute('data-content').split('/');
    const data = {
      name: content[0],
      description: content[1],
      updateAt: content[2],
      id: content[3],
      publicId: 2,
    };
    this.props.agreePublicProject(data)
      .then(result => {
        if (result.payload.data.length) {
          this.getPublicProject(1);
          this.openMessage('项目审批成功!');
        }
      });
  }

  @autobind
  cancelPublicProject(tabId, id) {
    const data = {
      id,
      publicId: 0,
    };
    this.props.agreePublicProject(data)
      .then(result => {
        if (result.payload.data.length) {
          this.getPublicProject(tabId);
          this.tabContent(tabId);
          this.openMessage('项目取消成功!');
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

  openMessage(message) {
    Message.success(message);
  }

  render() {
    const { content, isShow } = this.state;
    const review = isShow ? 'review' : '';
    const by = !isShow ? 'by' : '';
    // const bindTabContent = value => this.tabContent.bind(this, value);
    const bindTabContent = value => this.tabContent(value);

    return (
      <section className="review-project">
        <SubTitle tit="审核项目" />
        <ul className="navs">
          <li className={review && 'active'} onClick={() => { bindTabContent(1); }}>待审核</li>
          <li className={by && 'active'} onClick={() => { bindTabContent(2); }}>已通过</li>
        </ul>
        <table className={`content ${review}`}>
          <colgroup>
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
          </colgroup>
          <tbody>
            <tr>
              <th>项目名称</th>
              <th>申请理由</th>
              <th>申请时间</th>
              <th>操作</th>
            </tr>
            {
              content.map(v => {
                const dataContent = `${v.name}/${v.description}/${v.updateAt}/${v.id}`;
                return (
                  <tr>
                    <td>{v.name}</td>
                    <td>{v.description}</td>
                    <td>{v.updateAt}</td>
                    <td>
                      <button
                        data-content={dataContent}
                        onClick={this.agreeProject}
                        className="agree"
                      >
                        同意
                      </button>
                      <button
                        data-id={`${v.id}`}
                        onClick={() => this.cancelPublicProject(1, v.id)}
                        className="cancel"
                      >
                        拒绝
                      </button>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>

        <table className={`content ${by}`}>
          <colgroup>
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
          </colgroup>

          <tbody>
            <tr>
              <th>项目名称</th>
              <th>申请理由</th>
              <th>申请时间</th>
              <th>操作</th>
            </tr>
            {
              content.map(v => (
                <tr>
                  <td>{v.name}</td>
                  <td>{v.description}</td>
                  <td>{v.updateAt}</td>
                  <td>
                    <button
                      data-id={`${v.id}`}
                      onClick={() => this.cancelPublicProject(2, v.id)}
                      className="cancel"
                    >
                      拒绝
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </section>
    );
  }
}

export default ReviewProject;
