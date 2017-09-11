import process from 'process';
import Message from '../../components/common/Message/Message';
import redirectToLogin from '../../helpers/login';

export default () => next => action => {
  if (process.browser) {
    if (action.error) {
      Message.error('服务器错误');
    } else if (action.payload && action.payload.res === false) {
      const hasChinese = /[\u4E00-\u9FFF]+/g.test(action.payload.message);
      const message = hasChinese ? action.payload.message : '服务器错误';
      const nologinMessage = '获取用户信息失败，请重新登录';
      Message.error(message);
      if (message === nologinMessage) {
        redirectToLogin(true);
      }
    }
    return next(action);
  }
  return next(action);
};
