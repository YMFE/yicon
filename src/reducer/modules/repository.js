import {
  FETCH_HOME_DATA,
  FETCH_REPOSITORY_DATA,
  CLEAR_REPOSITORY_DATA,
  CHANGE_ICON_SIZE,
  RESET_ICON_SIZE,
  FETCH_TINY_REPOSITORY,
} from '../../constants/actionTypes';

const defaultSize = 32;

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
  iconSize: defaultSize,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HOME_DATA: {
      return {
        ...state,
        homeRepository: action.payload.data,
      };
    }
    case FETCH_TINY_REPOSITORY: {
      return {
        ...state,
        allReposotoryList: action.payload.data,
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
        iconSize: defaultSize,
      };
    }
    default:
      return state;
  }
};
