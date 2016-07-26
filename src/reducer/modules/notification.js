import {
  FETCH_ALL_INFO,
  FETCH_SYSTEM_INFO,
  FETCH_PROJECT_INFO,
} from '../../constants/actionTypes';

const initialState = {
  unReadCount: 0,
  allInfo: {
    unReadCount: 0,
    list: [],
  },
  systemInfo: {
    unReadCount: 0,
    list: [],
  },
  projectInfo: {
    unReadCount: 0,
    list: [],
  },
};

function countUnreadItem(list) {
  let count = 0;
  list.forEach(item => {
    if (item.userLog.unread) count += 1;
  });
  return count;
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_INFO: {
      if (action.payload.res) {
        const count = countUnreadItem(action.payload.data);
        const totalCount = count +
          parseInt(state.systemInfo.unReadCount, 10) +
          parseInt(state.projectInfo.unReadCount, 10);
        return {
          ...state,
          unReadCount: totalCount,
          allInfo: {
            unReadCount: count,
            list: action.payload.data,
          },
        };
      }
      return state;
    }
    case FETCH_SYSTEM_INFO: {
      if (action.payload.res) {
        const count = countUnreadItem(action.payload.data);
        const totalCount = count +
          parseInt(state.systemInfo.unReadCount, 10) +
          parseInt(state.projectInfo.unReadCount, 10);
        return {
          ...state,
          unReadCount: totalCount,
          systemInfo: {
            unReadCount: count,
            list: action.payload.data,
          },
        };
      }
      return state;
    }
    case FETCH_PROJECT_INFO: {
      if (action.payload.res) {
        const count = countUnreadItem(action.payload.data);
        const totalCount = count +
          parseInt(state.systemInfo.unReadCount, 10) +
          parseInt(state.projectInfo.unReadCount, 10);
        return {
          ...state,
          unReadCount: totalCount,
          projectInfo: {
            unReadCount: count,
            list: action.payload.data,
          },
        };
      }
      return state;
    }
    default:
      return state;
  }
};
