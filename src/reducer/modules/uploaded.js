import {
  FETCH_MY_LOADED,
  DELETE_ICON,
} from '../../constants/actionTypes';

import {
  fetchUploaded,
} from '../../actions/uploaded';
const initialState = {
  list: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MY_LOADED: {
      return {
        ...state,
        list: action.payload.data,
        totalPage: action.payload.page.totalCount,
        currentPage: action.payload.page.currentPage,
      };
    }
    case DELETE_ICON: {
      if (action.payload.ret) {
        fetchUploaded(1);
      } else {
        //  TODO 处理删除失败逻辑
      }
      return state;
    }
    default:
      return state;
  }
};
