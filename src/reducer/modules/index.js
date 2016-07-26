import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import repository from './repository';
import cart from './cart';
import project from './project';
import search from './search';
import setting from './setting';
import notification from './notification';
import uploaded from './uploaded';

export default combineReducers({
  routing: routerReducer,
  repository,
  cart,
  project,
  search,
  setting,
  notification,
  uploaded,
});
