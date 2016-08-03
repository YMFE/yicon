import {
  FETCH_USERS_PROJECT_INFO,
  FETCH_USERS_PROJECT_LIST,
  FETCH_PUBLIC_PROJECT_INFO,
  FETCH_PUBLIC_PROJECT_LIST,
  CHOSE_PROJECT_FOR_SAVE,
  SAVE_TO_NEW_PROJECT,
  DELETE_PROJECT,
  FETCH_MEMBERS_SUGGEST_LIST,
  PATCH_USERS_PROJECT_DETAIL,
  PATCH_PROJECT_MEMBERS,
  POST_GENERATE_VERSION,
  TETCH_PROJECT_VERSION,
  DELETE_PROJECT_ICON,
} from '../../constants/actionTypes';
import { push } from 'react-router-redux';
// dumpIconLocalStorage,
import {
  getUserProjectInfo,
  getUsersProjectList,
} from '../../actions/cart';

const initialState = {
  usersProjectList: [],
  publicProjectList: [],
  currentUserProjectInfo: {},
  memberSuggestList: [],
  currentPublicProjectInfo: {},
  currentUserProjectVersions: [],
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
        getUsersProjectList();
        getUserProjectInfo(action.project.id);
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
    case PATCH_PROJECT_MEMBERS: {
      if (action.payload.res) {
        getUserProjectInfo(action.project.id);
      }
      return state;
    }
    case TETCH_PROJECT_VERSION: {
      if (action.payload.res) {
        return {
          ...state,
          currentUserProjectVersions: action.payload.data.version,
        };
      }
      return state;
    }

    case POST_GENERATE_VERSION: {
      if (action.payload.res) {
        getUserProjectInfo(action.project.id);
      }
      return state;
    }
    case SAVE_TO_NEW_PROJECT: {
      return {
        ...state,
        usersProject: action.payload.data.organization,
      };
    }

    case CHOSE_PROJECT_FOR_SAVE: {
      return {
        ...state,
        projectForSave: action.payload,
      };
    }

    case DELETE_PROJECT: {
      if (action.payload.res) {
        push('/user/project');
      }
      return state;
    }
    case DELETE_PROJECT_ICON: {
      if (action.payload.res) {
        getUserProjectInfo(action.id);
      }
      return state;
    }
    default:
      return state;
  }
};
