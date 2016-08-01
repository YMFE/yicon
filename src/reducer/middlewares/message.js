import process from 'process';
import Message from '../../components/common/Message/Message';

export default () => next => action => {
  if (process.browser) {
    if (action.error) {
      Message.error(action.payload);
    } else if (action.payload && action.payload.res === false) {
      Message.error(action.payload.message || '服务器错误');
    }
    next(action);
  } else {
    next(action);
  }
};
