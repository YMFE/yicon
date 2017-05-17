import './StatusIcon.scss';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { addIconToLocalStorage, deleteIconInLocalStorage } from '../../actions/cart';
import Icon from '../common/Icon/Icon.jsx';
import { autobind } from 'core-decorators';

@connect(
  state => ({
    iconsInLocalStorage: state.cart.iconsInLocalStorage,
    userInfo: state.user.info,
  }),
  {
    addIconToLocalStorage,
    deleteIconInLocalStorage,
  }
)
class StatusIcon extends Component {

  static propTypes = {
    icon: PropTypes.object,
    userInfo: PropTypes.object,
    repoId: PropTypes.number,
    iconsInLocalStorage: PropTypes.array,
    deleteIconInLocalStorage: PropTypes.func,
    addIconToLocalStorage: PropTypes.func,
    statusDesc: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.array,
    ]),
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { props, state } = this;
    const iconId = props.icon.id;
    const iconEqual = props.icon === nextProps.icon;
    const userInfoEqual = props.userInfo === nextProps.userInfo;
    const repoIdEqual = props.repoId === nextProps.repoId;
    const isSelectChange = !~nextProps.iconsInLocalStorage.indexOf(iconId) ===
                           !~props.iconsInLocalStorage.indexOf(iconId);
    const stateEqual = state === nextState;
    if (iconEqual &&
        userInfoEqual &&
        repoIdEqual &&
        isSelectChange &&
        stateEqual) {
      return false;
    }
    return true;
  }

  getScreenDist(element) {
    let actualLeft = element.offsetLeft;
    let actualTop = element.offsetTop;
    let current = element.offsetParent;
    while (current !== null) {
      actualLeft += current.offsetLeft;
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }
    const { scrollTop, scrollLeft } = document.body;
    return {
      screenLeft: actualLeft - scrollLeft,
      screenTop: actualTop - scrollTop,
    };
  }

  addCartAnim() {
    const iconNode = findDOMNode(this.refs.icon);
    const { screenLeft, screenTop } = this.getScreenDist(iconNode);
    const { scrollTop, scrollLeft } = document.body;
    const iconCopy = iconNode.cloneNode(true);
    iconCopy.style.cssText += `
      top: ${screenTop + scrollTop}px;
      left: ${screenLeft + scrollLeft}px;
      transition: transform 0.3s ease-in, opacity 0.2s linear 0.3s;
      position: absolute;
      z-index: 1000;
    `;
    iconCopy.getElementsByTagName('path')[0].style.fill = '#008ed6';
    const cartNode = document.getElementsByClassName('global-header-cart')[0];
    const cartLeft = this.getScreenDist(cartNode).screenLeft;
    document.body.appendChild(iconCopy);
    setTimeout(() => {
      iconCopy.style.cssText += `
        transform: translate(${cartLeft - screenLeft}px, ${15 - screenTop}px);
        opacity: 0;
      `;
    }, 0);
    setTimeout(() => {
      iconCopy.remove();
    }, 1000);
  }

  removeCartAnim() {
    const iconNode = findDOMNode(this.refs.icon);
    const { scrollTop, scrollLeft } = document.body;
    const iconCopy = iconNode.cloneNode(true);
    const cartNode = document.getElementsByClassName('global-header-cart')[0];
    const cartLeft = this.getScreenDist(cartNode).screenLeft;
    iconCopy.style.cssText += `
      top: ${scrollTop + 15}px;
      left: ${scrollLeft + cartLeft}px;
      transition: transform 0.25s ease-in, opacity 0.2s linear;
      position: absolute;
      z-index: 1000;
    `;
    document.body.appendChild(iconCopy);
    setTimeout(() => {
      iconCopy.style.cssText += `
        transform: translate(-100px, -100px);
        opacity: 0;
      `;
    }, 0);
    setTimeout(() => {
      iconCopy.remove();
    }, 1000);
  }

  isSelected(id) {
    if (this.props.iconsInLocalStorage.indexOf(id) !== -1) {
      return true;
    }
    return false;
  }

  @autobind
  selectIcon(id) {
    return (e) => {
      if (e.target === this.refs.code) return;
      if (this.props.iconsInLocalStorage.indexOf(id) !== -1) {
        this.props.deleteIconInLocalStorage(id);
        this.removeCartAnim();
      } else {
        this.props.addIconToLocalStorage(id);
        this.addCartAnim();
      }
    };
  }

  render() {
    const { icon, statusDesc, children } = this.props;
    const selected = this.isSelected(icon.id);
    const fill = selected ? '#008ed6' : '#555f6e';

    return (
      <div className={`icon-status-item ${selected ? 'active' : ''}`}>
        <div className="info" onClick={this.selectIcon(icon.id)}>
          <div className="icon">
            <Icon
              size={32}
              fill={fill} d={icon.path}
              ref="icon"
            />
          </div>
          <div className="name" title={icon.name}>{icon.name}</div>
          <div ref="code" className="code">
            {`&#x${icon.code.toString(16)};`}
          </div>
        </div>
        {statusDesc ? (<div className="status-desc">{children}</div>) : null}
      </div>
    );
  }
}

export default StatusIcon;
