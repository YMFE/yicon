import {
  FETCH_REPOS,
  FETCH_PROJECTS,
  UPDATE_REPO_OWNER,
  UPDATE_PROJECT_OWNER,
  CREATE_REPO,
  CREATE_PROJECT,
  FETCH_SEARCH_REPOS,
  FETCH_SEARCH_PROJECTS,
  FETCH_SUPER_MANAGER,
  CREATE_SUPER_MANAGER,
  DELETE_SUPER_MANAGER,
  FETCH_DISABLED_CODE,
  SET_DISABLED_CODE,
  UNSET_DISABLED_CODE,
  UPDATE_DISABLED_CODE,
} from '../../constants/actionTypes';

// const initialState = { repo: [], project: [], page: {}, manager: [], updateResult: false };

const initialState = {
  repo: [],
  project: [],
  page: {},
  manager: [],
  updateResult: false,
  disabledCode: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REPOS: {
      return {
        ...state,
        repo: action.payload.data,
        page: action.payload.page,
      };
    }
    case FETCH_PROJECTS: {
      return {
        ...state,
        project: action.payload.data,
        page: action.payload.page,
      };
    }
    case UPDATE_REPO_OWNER: {
      return {
        ...state,
        updateResult: action.payload.res,
      };
    }
    case UPDATE_PROJECT_OWNER: {
      return {
        ...state,
        updateResult: action.payload.res,
      };
    }
    case CREATE_REPO: {
      return {
        ...state,
      };
    }
    case CREATE_PROJECT: {
      return {
        ...state,
      };
    }
    case FETCH_SEARCH_REPOS: {
      return {
        ...state,
        repo: action.payload.data,
        page: action.payload.page,
      };
    }
    case FETCH_SEARCH_PROJECTS: {
      return {
        ...state,
        project: action.payload.data,
        page: action.payload.page,
      };
    }
    case FETCH_SUPER_MANAGER: {
      return {
        ...state,
        manager: action.payload.data,
      };
    }
    case CREATE_SUPER_MANAGER: {
      return {
        ...state,
        manager: action.payload.data,
      };
    }
    case DELETE_SUPER_MANAGER: {
      return {
        ...state,
        manager: action.payload.data,
      };
    }
    case FETCH_DISABLED_CODE: {
      return {
        ...state,
        disabledCode: action.payload.data,
      };
    }
    case SET_DISABLED_CODE: {
      return {
        ...state,
        disabledCode: action.payload.data,
      };
    }
    case UNSET_DISABLED_CODE: {
      return {
        ...state,
        disabledCode: action.payload.data,
      };
    }
    case UPDATE_DISABLED_CODE: {
      return {
        ...state,
        disabledCode: action.payload.data,
      };
    }
    default:
      return state;
  }
};
