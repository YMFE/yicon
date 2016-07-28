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

  // 登录用户才使用的信息放到 user 下面
  user: combineReducers({
    info: user,
    notification,
    uploaded,
  }),
});

export default (s, action) => {
  const state = s;
  switch (action.type) {
    case LOGOUT_DESTORY:
      delete state.user;
      return state;
    default:
      return reducers(state, action);
  }
};
