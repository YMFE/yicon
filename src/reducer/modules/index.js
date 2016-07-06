import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import repository from './repository';
import cart from './cart/cart';
import setting from './setting';

export default combineReducers({
  routing: routerReducer,
  repository,
  cart,
  setting,
});
