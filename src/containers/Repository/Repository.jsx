import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router';
import {
  fetchRepository,
  changeIconSize,
  // resetIconSize,
} from '../../actions/repository';
import { getIconDetail, editIconStyle } from '../../actions/icon';
import SliderSize from '../../components/SliderSize/SliderSize';
import DownloadDialog from '../../components/DownloadDialog/DownloadDialog.jsx';
import UpdateDialog from '../../components/UpdateDialog/UpdateDialog.jsx';
import Dialog from '../../components/common/Dialog/Index.jsx';
import Loading from '../../components/common/Loading/Loading.jsx';
import { SubTitle } from '../../components/';
import { autobind } from 'core-decorators';

import './Repository.scss';
import IconButton from '../../components/common/IconButton/IconButton.jsx';

@connect(
  state => ({
    currRepository: state.repository.currRepository,
    userInfo: state.user.info,
  }),
  {
    fetchRepository,
    changeIconSize,
    // resetIconSize,
    getIconDetail,
    editIconStyle,
  }
)
export default class Repository extends Component {

  static propTypes = {
    fetchRepository: PropTypes.func,
    changeIconSize: PropTypes.func,
    // resetIconSize: PropTypes.func,
    getIconDetail: PropTypes.func,
    editIconStyle: PropTypes.func,
    currRepository: PropTypes.object,
    userInfo: PropTypes.object,
    params: PropTypes.object,
    push: PropTypes.func,
  };

  state = {
    isShowDownloadDialog: false,
    isShowUpdateDialog: false,
    isShowLoading: false,
  };

  componentWillMount() {
    this._isMounted = true;
  }

  componentDidMount() {
    this.fetchRepositoryWrapper();
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.fetchRepositoryWrapper(nextProps.params.id);
      this.refs.myslider.getWrappedInstance().reset();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('scroll', this.handleScroll);
  }

  @autobind
  getIconsDom() {
    return findDOMNode(this.refs.iconsContainer).getElementsByClassName('Icon');
  }

  @autobind
  handleScroll() {
    const scrollTop = document.body.scrollTop;
    const element = findDOMNode(this.refs.repo);
    if (scrollTop >= 64) {
      element.setAttribute('class', 'repository fixed');
    } else {
      element.setAttribute('class', 'repository');
    }
  }

  @autobind
  fetchRepositoryWrapper(currentId) {
    let { params: { id } } = this.props;
    if (currentId) id = currentId;

    this.setState({
      isShowLoading: true,
    }, () => {
      this.refs.myslider.getWrappedInstance().reset();
      this.props.fetchRepository(id)
        .then(
          () => {
            if (this._isMounted) {
              this.setState({ isShowLoading: false });
            }
          }
        )
        .catch(
          () => {
            if (this._isMounted) {
              this.setState({ isShowLoading: false });
            }
          }
        );
    });
  }

  @autobind
  changeSize(value) {
    this.props.changeIconSize(value);
  }

  @autobind
  clickIconDownloadBtn(iconId) {
    return () => {
      this.props.getIconDetail(iconId).then(() => {
        this.props.editIconStyle({ color: '#34475e', size: 256 });
        this.setState({
          isShowDownloadDialog: true,
        });
      });
    };
  }

  @autobind
  updateIconInfo(iconId) {
    this.props.getIconDetail(iconId).then(() => {
      this.props.editIconStyle({ color: '#34475e', size: 255 });
      this.setState({
        isShowUpdateDialog: true,
      });
    });
  }

  @autobind
  closeUpdateDialog() {
    const { params: { id } } = this.props;
    this.props.fetchRepository(id)
      .then(
        () => {
          if (this._isMounted) {
            this.setState({ isShowUpdateDialog: false });
          }
        }
      )
      .catch(
        () => {
          if (this._isMounted) {
            this.setState({ isShowUpdateDialog: false });
          }
        }
      );
  }

  @autobind
  dialogDownloadShow(isShow) {
    const { params: { id } } = this.props;
    const { currentPage } = this.props.currRepository;
    this.setState({
      isShowDownloadDialog: isShow,
    });
    this.props.fetchRepository(id, currentPage);
  }

  @autobind
  dialogUpdateShow(isShow) {
    const { params: { id } } = this.props;
    const { currentPage } = this.props.currRepository;
    this.setState({
      isShowUpdateDialog: isShow,
    });
    this.props.fetchRepository(id, currentPage);
  }

  @autobind
  downloadAllIcons() {
    const { id } = this.props.params;
    axios
      .post('/api/download/font', { type: 'repo', id })
      .then(({ data }) => {
        if (data.res) {
          const { foldName } = data.data;
          window.location.href = `/download/${foldName}`;
        }
      });
  }

  render() {
    const { name, icons, user, iconCount } = this.props.currRepository;
    const userInfo = this.props.userInfo;
    const { id: repoId } = this.props.params;
    let admin = '';
    if (user) {
      admin = user.name;
    }
    // 登录状态：1：未登录  2：普通用户登录  3：管理员登录
    let status = 1;
    if (userInfo.login) {
      status = 2;
      if (userInfo.admin || userInfo.repoAdmin.indexOf(+repoId) !== -1) {
        status = 3;
      }
    }
    return (
      <div className="repository" ref="repo">
        <SubTitle tit={`${name || ''}图标库`}>
          <div className="sub-title-chil">
            <span className="count">
              <b className="num">{iconCount || 0}</b>icons
            </span>
            <span className="powerby">管理员:</span>
            <span className="name">{admin}</span>
            <div className="tool-content">
              <div className="tools">
                {status > 1 &&
                  <Link to={`/upload/repository/${repoId}`} className="options-btns btns-blue">
                    <i className="iconfont">&#xf50a;</i>上传新图标
                  </Link>
                }
                <button
                  onClick={this.downloadAllIcons}
                  className="options-btns btns-blue"
                >
                  <i className="iconfont">&#xf50b;</i>下载全部图标
                </button>
                {status === 3 &&
                  <Link
                    to={`/repositories/${repoId}/logs`}
                    className="options-btns btns-default"
                  >
                    查看日志
                  </Link>
                }
              </div>
              <SliderSize ref="myslider" getIconsDom={this.getIconsDom} />
            </div>
          </div>
        </SubTitle>
        <div className="yicon-detail-main">
          <div className="yicon-detail-list clearfix" ref="iconsContainer">
            {
              icons.map((icon) => (
                <IconButton
                  icon={icon}
                  key={icon.id}
                  download={this.clickIconDownloadBtn(icon.id)}
                  update={() => { this.updateIconInfo(icon.id); }}
                  toolBtns={['copytip', 'copy', 'edit', 'download', 'update']}
                />
              ))
            }
          </div>
        </div>
        <Dialog
          empty
          visible={this.state.isShowDownloadDialog}
          getShow={this.dialogDownloadShow}
        >
          <DownloadDialog type="repo" />
        </Dialog>
        <Dialog
          empty
          // visible={this.state.isShowUpdateDialog}
          visible={this.state.isShowUpdateDialog}
          getShow={this.dialogUpdateShow}
        >
          <UpdateDialog type="repo" closeUpdateDialog={this.closeUpdateDialog} />
        </Dialog>
        <Loading visible={this.state.isShowLoading} />
      </div>
    );
  }
}

Repository.appPageTitle = '图标大库';
