import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import repository from './repository';

export default combineReducers({
  routing: routerReducer,
  repository,
});
