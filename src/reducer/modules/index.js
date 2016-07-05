import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import repository from './repository';
import currRepository from './currRepository';
import initCart from './initCart';
import getCartIcons from './getCartIcons';
import setting from './setting';

export default combineReducers({
  routing: routerReducer,
  repository,
  currRepository,
  cartIconIds: initCart,
  cartIcons: getCartIcons,
  setting,
});
