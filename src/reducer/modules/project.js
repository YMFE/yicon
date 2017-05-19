import {
  TOGGLE_CREATE_PROJECT,
  FETCH_USERS_PROJECT_INFO,
  FETCH_USERS_PROJECT_LIST,
  FETCH_PUBLIC_PROJECT_INFO,
  FETCH_PUBLIC_PROJECT_LIST,
  CHOSE_PROJECT_FOR_SAVE,
  SAVE_TO_NEW_PROJECT,
  DELETE_PROJECT,
  FETCH_MEMBERS_SUGGEST_LIST,
  FETCH_ALL_PROJECT,
  FETCH_ALL_VERSION,
  COMPARE_PROJECT_VERSION,
  FETCH_HISTORY_PROJECT,
  SET_ADJUST_BASELINE,
} from '../../constants/actionTypes';

const initialState = {
  isShowCreateProject: false,
  usersProjectList: [],
  publicProjectList: [],
  currentUserProjectInfo: {},
  memberSuggestList: [],
  currentPublicProjectInfo: {},
  projectForSave: {
    id: 0,
    name: '',
  },
  myProjects: {
    id: 0,
    organization: [],
  },
  projectInfo: {
    name: '',
    versions: [],
  },
  comparisonResult: {
    deleted: [],
    added: [],
    replaced: [],
  },
  historyProject: {
    icons: [],
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_CREATE_PROJECT: {
      return {
        ...state,
        isShowCreateProject: action.payload.isShowCreateProject,
      };
    }
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
      const currentUserProjectInfo = action.payload.data;
      return {
        ...state,
        currentUserProjectInfo,
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
        return {
          ...state,
        };
      }
      return state;
    }

    case FETCH_ALL_PROJECT: {
      return {
        ...state,
        myProjects: {
          id: action.payload.data.id,
          organization: action.payload.data.organization,
        },
      };
    }

    case FETCH_ALL_VERSION: {
      return {
        ...state,
        projectInfo: {
          name: action.payload.data.project.name,
          versions: action.payload.data.version,
        },
      };
    }

    case COMPARE_PROJECT_VERSION: {
      return {
        ...state,
        comparisonResult: {
          deleted: action.payload.data.deleted,
          added: action.payload.data.added,
          replaced: action.payload.data.replaced,
        },
      };
    }

    case FETCH_HISTORY_PROJECT: {
      return {
        ...state,
        historyProject: action.payload.data,
      };
    }

    case SET_ADJUST_BASELINE: {
      return {
        ...state,
        currentUserProjectInfo: {
          ...state.currentUserProjectInfo,
          baseline: action.payload.data.baseline,
        },
      };
    }

    default:
      return state;
  }
};
