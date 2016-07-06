import { combineReducers } from 'redux';
import iconsInLocalStorage from './iconsInLocalStorage';
import iconsInCart from './iconsInCart';

export default combineReducers({
  iconsInLocalStorage,
  iconsInCart,
});
