import {
  LAUNCH_REDUX_DEVTOOLS,
} from '../../constants/actionTypes';

const initialState = {
  devTools: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LAUNCH_REDUX_DEVTOOLS: {
      return {
        devTools: true,
      };
    }
    default:
      return state;
  }
};
