import {
  FETCH_USER_INFO,
} from '../../constants/actionTypes';

const initialState = {
  userId: null,
  name: null,
  real: null,
  login: false,
  repoAdmin: [],
  admin: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_INFO:
      return action.payload;
    default:
      return state;
  }
};
