import {
  FETCH_MY_LOADED,
  DELETE_ICON,
} from '../../constants/actionTypes';

const initialState = {
  list: [],
  totalPage: 1,
  currentPage: 1,
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
      return state;
    }
    default:
      return state;
  }
};
