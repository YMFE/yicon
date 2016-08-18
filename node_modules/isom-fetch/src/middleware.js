import process from 'process';
import { getUrlState } from './defaults';

const privateType = '@@isom-fetch/data-rendered-by-server-side';

const isomFetchMiddleware = ({ dispatch }) => next => action => {
  if (process.browser) {
    const { payload } = action;
    if (typeof payload === 'function' && payload.isomFetch === true) {
      const fetched = window[getUrlState()];
      if (fetched && fetched[payload.url] > 0) {
        // 如果已经被渲染，就无需执行这次 dispatch，直接返回未被 reducer 处理的 state
        fetched[payload.url]--;
        action.type = privateType;
        return next(action);
      }
      return payload(dispatch, action);
    }
  }
  return next(action);
};

export default isomFetchMiddleware;
