import {
  FETCH_USERS_PROJECT_INFO,
  FETCH_USERS_PROJECT_LIST,
  FETCH_PUBLIC_PROJECT_INFO,
  FETCH_PUBLIC_PROJECT_LIST,
  CHOSE_PROJECT_FOR_SAVE,
  SAVE_TO_NEW_PROJECT,
  SAVE_TO_PROJECT,
  FETCH_MEMBERS_SUGGEST_LIST,
  PATCH_USERS_PROJECT_DETAIL,
} from '../../constants/actionTypes';

import {
  dumpIconLocalStorage,
} from '../../actions/cart';

const initialState = {
  usersProjectList: [],
  publicProjectList: [],
  currentUserProjectInfo: {},
  memberSuggestList: [],
  currentPublicProjectInfo: {},
  projectForSave: {
    id: 0,
    name: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_PROJECT_LIST: {
      if (action.payload.res) {
        return {
          ...state,
          usersProjectList: action.payload.data.organization,
        };
      }
      return state;
    }
    case FETCH_USERS_PROJECT_INFO: {
      if (action.payload.res) {
        return {
          ...state,
          currentUserProjectInfo: action.payload.data,
        };
      }
      return state;
    }
    case PATCH_USERS_PROJECT_DETAIL: {
      if (action.payload.res) {
        // TODO 编辑成功
      } else {
        // TODO 编辑失败
      }
      return state;
    }
    case FETCH_MEMBERS_SUGGEST_LIST: {
      if (action.payload.res) {
        return {
          ...state,
          memberSuggestList: action.payload.data,
        };
      }
      return state;
    }
    case FETCH_PUBLIC_PROJECT_LIST: {
      if (action.payload.res) {
        return {
          ...state,
          publicProjectList: action.payload.data,
        };
      }
      return state;
    }
    case FETCH_PUBLIC_PROJECT_INFO: {
      if (action.payload.res) {
        return {
          ...state,
          currentPublicProjectInfo: action.payload.data,
        };
      }
      return state;
    }
    case SAVE_TO_NEW_PROJECT: {
      // if (action.res) {
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
        if (action.res) {
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
      return state;
  }
};
