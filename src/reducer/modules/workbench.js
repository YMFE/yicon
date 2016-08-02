import {
  FETCH_WORKBENCH_ICONS,
  DELETE_WORKBENCH_ICON,
} from '../../constants/actionTypes';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WORKBENCH_ICONS: {
      // console.log(action.payload.data)
      return action.payload.data;
    }
    case DELETE_WORKBENCH_ICON: {
      return action.payload.data;
    }
    default:
      return state;
  }
};
