import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import repository from './repository';
import cart from './cart';
import project from './project';
import search from './search';
import setting from './setting';
import notification from './notification';
import uploaded from './uploaded';
import user from './user';
import icon from './icon';
import log from './log';
import workbench from './workbench';
import repWorkbench from './repWorkbench';
import audit from './audit';
import admin from './admin';

import {
  LOGOUT_DESTORY,
} from '../../constants/actionTypes';

const reducers = combineReducers({
  routing: routerReducer,
  repository,
  cart,
  project,
  search,
  setting,
  icon,
  log,
  workbench,
  repWorkbench,
  audit,

  // TODO: 其实没啥用，因为登出的时候直接跳页就行了。。。。
  // 登录用户才使用的信息放到 user 下面
  user: combineReducers({
    info: user,
    notification,
    uploaded,
    admin,
  }),
});

export default (s, action) => {
  const state = s;
  // 高层阻断，当数据返回错误时不遍历 reducer 和修改 state
  if (action.error || (action.payload && action.payload.res === false)) {
    return state;
  }
  switch (action.type) {
    case LOGOUT_DESTORY:
      delete state.user;
      return state;
    default:
      return reducers(state, action);
  }
};
