Redux DevTools Instrumentation
==============================

Redux enhancer used along with [Redux DevTools](https://github.com/gaearon/redux-devtools) or [Remote Redux DevTools](https://github.com/zalmoxisus/remote-redux-devtools).

### Installation

```
npm install --save-dev redux-devtools-instrument
```

### Usage

Add the store enhancer:

##### `store/configureStore.js`

```js
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import reducer from '../reducers';

// Usually you import the reducer from the monitor
// or apply with createDevTools as explained in Redux DevTools
const monitorReducer = (state = {}, action) => state; 

export default function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(...middlewares),
    // other enhancers and applyMiddleware should be added before the instrumentation
    instrument(monitorReducer, { maxAge: 50 })
  );
  
  // Note: passing enhancer as last argument requires redux@>=3.1.0
  return createStore(reducer, initialState, enhancer);
}
```

### API

`instrument(monitorReducer, [options])`

- arguments
  - **monitorReducer** *function* called whenever an action is dispatched ([see the example of a monitor reducer](https://github.com/gaearon/redux-devtools-log-monitor/blob/master/src/reducers.js#L13)).
  - **options** *object*
    - **maxAge** *number* - maximum allowed actions to be stored on the history tree, the oldest actions are removed once `maxAge` is reached. 
    - **shouldCatchErrors** *boolean* - if specified as `true`, whenever there's an exception in reducers, the monitors will show the error message, and next actions will not be dispatched.

### License

MIT
