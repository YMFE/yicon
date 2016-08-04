import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


import { fetchAuditList } from '../../actions/audit';
// import IconBgGrid from '../../components/common/IconBgGrid/IconBgGrid';
// import Select from '../../components/common/Select/';
// import SetTag from '../../components/EditIcon/SetTag/SetTag.jsx';
import Slick from '../../components/common/Slick/index.jsx';
// import Input from '../../components/common/Input/Index.jsx';

@connect(
  state => ({ auditList: state.user.audit.list }),
  { fetchAuditList }
)
export default class Audit extends Component {
  static propTypes = {
    fetchAuditList: PropTypes.func,
    auditList: PropTypes.func,
  }

  componentWillMount() {
    this.props.fetchAuditList();
  }
  render() {
    const { auditList } = this.props;
    return (
      <div className="yicon-main yicon-upload">
        <div className="yicon-upload-container">
          <h2 className="upload-title">图标审核</h2>
          <Slick
            itemData={auditList}
            defaultCurrent={1}
            onClick={(index) => { console.log(index); }}
            onDelete={(index) => { console.log(index); }}
            step={84}
            noRemoveIcon
          />
          <div className="upload-setting clearfix">
          </div>
        </div>
      </div>
    );
  }
}
