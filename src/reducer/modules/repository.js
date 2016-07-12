import {
  FETCH_HOME_DATA,
  FETCH_REPOSITORY_DATA,
  CLEAR_REPOSITORY_DATA,
} from '../../constants/actionTypes';

const initialState = {
  homeRepository: [],
  currRepository: {
    icons: [],
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HOME_DATA: {
      return {
        ...state,
        homeRepository: action.payload.data,
      };
    }
    case FETCH_REPOSITORY_DATA: {
      return {
        ...state,
        currRepository: action.payload.data,
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
    default:
      return state;
  }
};
