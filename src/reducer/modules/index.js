import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import repository from './repository';
import initCart from './initCart';
import getCartIcons from './getCartIcons';
import setting from './setting';

export default combineReducers({
  routing: routerReducer,
  repository,
  cartIconIds: initCart,
  cartIcons: getCartIcons,
  setting,
});
