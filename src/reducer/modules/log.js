import {
  FETCH_REPOSITORY_LOG,
  FETCH_PROJECT_LOG,
} from '../../constants/actionTypes';

const initialState = {
  repo: {
    list: [],
    currentPage: 1,
    totalCount: 0,
  },
  project: {
    list: [],
    currentPage: 1,
    totalCount: 0,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REPOSITORY_LOG: {
      const { currentPage, totalCount } = action.payload.page;
      return {
        ...state,
        repo: {
          list: action.payload.data,
          currentPage,
          totalCount,
        },
      };
    }
    case FETCH_PROJECT_LOG: {
      const { currentPage, totalCount } = action.payload.page;
      return {
        ...state,
        project: {
          list: action.payload.data,
          currentPage,
          totalCount,
        },
      };
    }
    default:
      return state;
  }
};
