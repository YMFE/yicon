import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import repository from './repository';
import initCart from './initCart';
import getCartDes from './getCartDes';
import setting from './setting';

export default combineReducers({
  routing: routerReducer,
  repository,
  cartIcons: initCart,
  cartDes: getCartDes,
  setting,
});
