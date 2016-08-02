import {
  FETCH_USERS_PROJECT_INFO,
  CHOSE_PROJECT_FOR_SAVE,
} from '../../constants/actionTypes';

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
        usersProject: action.payload.data.organization,
      };
    }

    case CHOSE_PROJECT_FOR_SAVE: {
      return {
        ...state,
        projectForSave: action.payload,
      };
    }

    default:
      return state;
  }
};
