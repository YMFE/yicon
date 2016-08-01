import {
  FETCH_ICON_DETAIL,
  EDIT_ICON,
  EDIT_ICON_STYLE,
} from '../../constants/actionTypes';

const initialState = {
  iconStyle: {
    color: '#000',
    size: 0,
  },
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
      return {
        ...state,
        ...action.payload.data,
      };
    }
    case EDIT_ICON: {
      return {
        ...state,
        ...action.payload.data,
      };
    }
    case EDIT_ICON_STYLE: {
      return {
        ...state,
        iconStyle: {
          ...state.iconStyle,
          ...action.payload,
        },
      };
    }
    default:
      return state;
  }
};
