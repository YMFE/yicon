import {
  FETCH_ICON_DETAIL,
  EDIT_ICON,
} from '../../constants/actionTypes';

const initialState = {
  name: '',
  tags: '',
  id: 0,
  repo: {
    id: 0,
  },
  user: {
    name: '',
  },
  path: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ICON_DETAIL: {
      return action.payload.data;
    }
    case EDIT_ICON: {
      return {
        ...state,
        ...action.payload.data,
      };
    }
    default:
      return state;
  }
};
