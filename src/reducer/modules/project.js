import {
  FETCH_USERS_PROJECT_INFO,
  CHOSE_PROJECT_FOR_SAVE,
  SAVE_TO_NEW_PROJECT,
  SAVE_TO_PROJECT,
} from '../../constants/actionTypes';

import {
  dumpIconLocalStorage,
} from '../../actions/cart';

const initialState = {
  usersProject: [],
  projectForSave: {
    id: 0,
    name: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_PROJECT_INFO: {
      return {
        ...state,
        usersProject: action.organization,
      };
    }
    case SAVE_TO_NEW_PROJECT: {
      // if (action.ret) {
      //
      // }
      return {

      };
    }

    case CHOSE_PROJECT_FOR_SAVE: {
      return {
        ...state,
        projectForSave: action.project,
      };
    }

    case SAVE_TO_PROJECT: {
      return (dispatch) => {
        if (action.ret) {
          // TODO
          // 处理存储成功的交互
          dispatch(dumpIconLocalStorage);
        } else {
          // TODO
          // 处理存储失败的交互
        }
        return state;
      };
    }

    default:
      return {};
  }
};
