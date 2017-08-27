import {
  FETCH_WORKBENCH_ICONS,
  DELETE_WORKBENCH_ICON,
  UPDATE_WORKBENCH,
  SELECT_EDIT,
  SELECT_REPO,
  ADJUST_ICON,
} from '../../constants/actionTypes';

const initialState = {
  icons: [],
  selcIndex: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WORKBENCH_ICONS: {
      return {
        ...state,
        icons: action.payload.data,
      };
    }
    case UPDATE_WORKBENCH: {
      return {
        ...state,
        icons: action.payload,
      };
    }
    case DELETE_WORKBENCH_ICON: {
      return {
        ...state,
        icons: action.payload,
      };
    }
    case SELECT_EDIT: {
      return {
        ...state,
        selcIndex: action.payload,
      };
    }
    case SELECT_REPO: {
      return {
        ...state,
        repoId: action.payload,
      };
    }
    case ADJUST_ICON: {
      return {
        ...state,
        icons: action.payload,
      };
    }
    default:
      return state;
  }
};
