import {
  FETCH_HOME_DATA,
} from '../../constants/actionTypes';

const initialState = {
  list: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HOME_DATA: {
      return {
        list: action.payload.data,
      };
    }
    default:
      return state;
  }
};
