import {
  FETCH_ICON_STATISTIC,
} from '../../constants/actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ICON_STATISTIC: {
      return {
        ...state,
        ...action.payload.data,
      };
    }
    default:
      return state;
  }
};
