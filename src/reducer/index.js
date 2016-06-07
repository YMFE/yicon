import { createStore, applyMiddleware, compose } from 'redux';
import reduxPromise from 'redux-promise';
import reduxThunk from 'redux-thunk';
import { persistState } from 'redux-devtools';
import DevTools from '../containers/DevTools/DevTools';
import reducer from './modules';

export default (initialState) => {
  const middleware = [reduxPromise, reduxThunk];

  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(createStore);
  }

  const store = finalCreateStore(reducer, initialState);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules', () => {
      store.replaceReducer(reducer);
    });
  }

  return store;
};
