import {
  FETCH_WORKBENCH_ICONS,
} from '../../constants/actionTypes';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WORKBENCH_ICONS: {
      // console.log(action.payload.data)
      return action.payload.data;
    }
    default:
      return state;
  }
};
