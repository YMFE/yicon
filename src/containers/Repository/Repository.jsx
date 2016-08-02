import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router';
import {
  fetchRepositoryData,
  changeIconSize,
  resetIconSize,
} from '../../actions/repository';
import { getIconDetail, editIconStyle } from '../../actions/icon';
import SliderSize from '../../components/SliderSize/SliderSize';
import Pager from '../../components/common/Pager';
import DownloadDialog from '../../components/DownloadDialog/DownloadDialog.jsx';
import Dialog from '../../components/common/Dialog/Index.jsx';
import { SubTitle } from '../../components/';
import { autobind } from 'core-decorators';

import './Repository.scss';
import IconButton from '../../components/common/IconButton/IconButton.jsx';

const pageSize = 64;

@connect(
  state => ({
    currRepository: state.repository.currRepository,
    iconSize: state.repository.iconSize,
  }),
  {
    fetchRepositoryData,
    changeIconSize,
    resetIconSize,
    getIconDetail,
    editIconStyle,
  }
)
export default class Repository extends Component {

  static propTypes = {
    fetchRepositoryData: PropTypes.func,
    changeIconSize: PropTypes.func,
    resetIconSize: PropTypes.func,
    getIconDetail: PropTypes.func,
    editIconStyle: PropTypes.func,
    iconSize: PropTypes.number,
    currRepository: PropTypes.object,
    params: PropTypes.object,
    push: PropTypes.func,
  }

  state = {
    isShowDownloadDialog: false,
  }

  componentDidMount() {
    this.fetchRepositoryByPage(1);
    this.props.resetIconSize();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.props.fetchRepositoryData(nextProps.params.id, 1);
      this.props.resetIconSize();
    }
  }

  @autobind
  fetchRepositoryByPage(page) {
    const { params: { id } } = this.props;
    this.props.fetchRepositoryData(id, page);
  }

  @autobind
  changeSize(value) {
    this.props.changeIconSize(value);
  }

  @autobind
  clikIconDownloadBtn(iconId) {
    return () => {
      this.props.getIconDetail(iconId).then(() => {
        this.props.editIconStyle({ color: '#000', size: 255 });
        this.setState({
          isShowDownloadDialog: true,
        });
      });
    };
  }

  @autobind
  dialogUpdateShow(isShow) {
    this.setState({
      isShowDownloadDialog: isShow,
    });
  }

  @autobind
  downloadAllIcons() {
    const { id } = this.props.params;
    axios
      .post('/api/download/font', { type: 'repo', id })
      .then(({ data }) => {
        if (data.res) {
          window.location.href = `/download/${data.data}`;
        }
      });
  }

  render() {
    const { name, icons, user, currentPage, totalPage } = this.props.currRepository;
    // 待解决：initialState已经写为'{}', 不知道为啥初始user还是为undefined
    const { id } = this.props.params;
    let admin = '';
    if (user) {
      admin = user.name;
    }
    return (
      <div className="repository">
        <SubTitle tit={`${name}图标库`}>
          <div className="sub-title-chil">
            <span className="count"><b className="num">{totalPage}</b>icons</span>
            <span className="powerby">管理员:</span>
            <span className="name">{admin}</span>
            <div className="tool-content">
              <div className="tools">
                <Link to="/upload" className="options-btns btns-blue">
                  <i className="iconfont">&#xf50a;</i>上传新图标
                </Link>
                <button
                  onClick={this.downloadAllIcons}
                  className="options-btns btns-blue"
                >
                  <i className="iconfont">&#xf50b;</i>下载全部图标
                </button>
                <Link
                  to={`/repositories/${id}/logs`}
                  className="options-btns btns-default"
                >
                  查看日志
                </Link>
              </div>
              <SliderSize />
            </div>
          </div>
        </SubTitle>
        <div className="yicon-detail-main">
          <div className="yicon-detail-list clearfix">
            {
              icons.map((icon) => (
                <IconButton
                  icon={icon}
                  key={icon.id}
                  download={this.clikIconDownloadBtn(icon.id)}
                  toolBtns={['copytip', 'copy', 'edit', 'download', 'cart']}
                />
              ))
            }
          </div>
          {totalPage > pageSize &&
            <Pager
              defaultCurrent={currentPage}
              onClick={this.fetchRepositoryByPage}
              totalPage={Math.ceil(totalPage / pageSize)}
            />
          }
        </div>
        <Dialog
          empty
          visible={this.state.isShowDownloadDialog}
          getShow={this.dialogUpdateShow}
        >
          <DownloadDialog />
        </Dialog>
      </div>
    );
  }
}
