import {
  FETCH_ICON_STATISTIC,
} from '../../constants/actionTypes';

const initialState = { list: [], data: [], skiped: 0, count: 0, total: 0 };

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
