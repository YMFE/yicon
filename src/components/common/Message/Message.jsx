import './Message.scss';
import classnames from 'classnames';
import React from 'react';
import Notification from 'rc-notification';

// 构建一个 Notification 的单例
let messageInstance;
// 默认配置项
let defaultTop = 40;
let defaultDuration = 1.5;

const prefixCls = 'g-message';

let key = 1;

function getMessageInstance() {
  messageInstance = messageInstance || Notification.newInstance({
    prefixCls,
    style: { top: defaultTop },
  });
  return messageInstance;
}

function notice(content, type, callback) {
  const instance = getMessageInstance();
  const borderCls = classnames('tip', `tip-${type}`);
  const iconMap = {
    error: <div className={borderCls}><i className="iconfont">&#xf077;</i></div>,
    success: <div className={borderCls}><i className="iconfont">&#xf078;</i></div>,
  };
  instance.notice({
    key,
    duration: defaultDuration,
    style: {},
    content: (
      <div className={`${prefixCls}-custom-content ${prefixCls}-${type}`}>
        {iconMap[type]}
        <span>{content}</span>
      </div>
    ),
    onClose: callback,
  });
  return (() => {
    const target = key++;
    return () => {
      instance.removeNotice(target);
    };
  })();
}

export default {
  error: (content, callback) => notice(content, 'error', callback),
  config: ({ top, duration }) => {
    defaultTop = top;
    defaultDuration = duration;
  },
};
