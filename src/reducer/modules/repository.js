import {
  FETCH_HOME_DATA,
  FETCH_REPOSITORY_DATA,
  CLEAR_REPOSITORY_DATA,
  CHANGE_ICON_SIZE,
  RESET_ICON_SIZE,
} from '../../constants/actionTypes';

const initialState = {
  allReposotoryList: [],
  homeRepository: [],
  currRepository: {
    currentPage: 1,
    totalPage: 0,
    icons: [],
    user: { name: '' },
    id: 0,
  },
  iconSize: 64,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HOME_DATA: {
      return {
        ...state,
        homeRepository: action.payload.data,
        allReposotoryList: action.payload.data.map((item) => ({ id: item.id, name: item.name })),
      };
    }
    case FETCH_REPOSITORY_DATA: {
      return {
        ...state,
        currRepository: {
          ...action.payload.data,
          currentPage: action.payload.page.currentPage,
          totalPage: action.payload.page.totalCount,
        },
      };
    }
    case CLEAR_REPOSITORY_DATA: {
      return {
        ...state,
        currRepository: {
          icons: [],
        },
      };
    }
    case CHANGE_ICON_SIZE: {
      return {
        ...state,
        iconSize: action.payload,
      };
    }
    case RESET_ICON_SIZE: {
      return {
        ...state,
        iconSize: 64,
      };
    }
    default:
      return state;
  }
};
