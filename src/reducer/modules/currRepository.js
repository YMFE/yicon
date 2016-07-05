import {
  FETCH_REPOSITORY_DATA,
} from '../../constants/actionTypes';

const currRepostitory = {
  list: [],
};

export default (state = currRepostitory, action) => {
  switch (action.type) {
    case FETCH_REPOSITORY_DATA: {
      return {
        list: action.payload.data.icons,
      };
    }
    default:
      return state;
  }
};
