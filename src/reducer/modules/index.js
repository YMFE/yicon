import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import repository from './repository';
import initCart from './initCart';

export default combineReducers({
  routing: routerReducer,
  repository,
  cartIcons: initCart,
});
