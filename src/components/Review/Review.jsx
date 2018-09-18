import './Review.scss';
import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import dialog from '../../components/common/Dialog/Confirm.jsx';

class Review extends Component {
  static propTypes = {
    agreeHandle: PropTypes.func,
    cancelHandle: PropTypes.func,
    content: PropTypes.any,
    showDescList: PropTypes.any,
    showKeys: PropTypes.any,
    showTabLayout: PropTypes.any,
    title: PropTypes.str,
    agreeContent: PropTypes.str,
    cancelContent: PropTypes.str,
    section: PropTypes.str,
  }

  getTheValue(data, key) {
    if (!data.hasOwnProperty(key)) return '';

    return data[key];
  }

  setDialog(title, content, method) {
    dialog({
      title,
      content,
      onOk: () => method(),
    });
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
    const { content = [],
            showDescList = [],
            showKeys = [],
            showTabLayout = [],
            title = '',
            agreeContent = '',
            cancelContent = '' } = this.props;

    const getDataTime = (time) => {
      let datatime = time.replace('T', ' ');
      datatime = datatime.replace(/\.[0-9A-Z]+/g, '');
      return datatime;
    };

    return (
      <table className={`content ${this.props.section}`}>
        <colgroup>
          {
            showTabLayout.map((v, index) =>
              <col key={`col_${index}`} width={`${v}%`} />
            )
          }
        </colgroup>
        <tbody>
          <tr>
            {
              showDescList.map((desc, k) =>
                <th key={k}>{desc}</th>
              )
            }
            <th>操作</th>
          </tr>
          {
            content.length ? content.map((v, k) =>
              <tr key={k}>
                {
                  showKeys.map((key) => {
                    if (key === 'description') {
                      return (
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
                      );
                    }
                    const values = key.split('.');
                    let data = v;

                    values.forEach(theKey => {
                      data = this.getTheValue(data, theKey);
                      if (theKey.indexOf('At') >= 0) {
                        data = getDataTime(data);
                      }
                    });

                    return <td key={key}>{data}</td>;
                  })
                }

                {
                  this.props.section !== 'review' ? null :
                    <td>
                      <button
                        onClick={
                          () => this.setDialog(
                            title, agreeContent, () => this.props.agreeHandle(v, 'agree')
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
                            title, cancelContent, () => this.props.cancelHandle(v, 'cancel')
                          )
                        }
                        className="cancel"
                      >
                        拒绝
                      </button>
                    </td>
                }

                {
                  this.props.section !== 'by' ? null :
                    <td>
                      <button
                        data-id={`${v.id}`}
                        onClick={
                          () => this.setDialog(
                            title, cancelContent, () => this.props.cancelHandle(2, v.id)
                          )
                        }
                        className="cancel"
                      >
                        取消
                      </button>
                    </td>
                }
              </tr>
            ) : <tr><td className="no-data" colSpan="9">暂无数据</td></tr>
          }
        </tbody>
      </table>
    );
  }
}

export default Review;
