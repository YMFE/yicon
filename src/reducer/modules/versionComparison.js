import {
  FETCH_ALL_PROJECT,
  FETCH_ALL_VERSION,
  COMPARE_PROJECT_VERSION,
} from '../../constants/actionTypes';

const initialState = {
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
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
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
        },
      };
    }
    default:
      return state;
  }
};
