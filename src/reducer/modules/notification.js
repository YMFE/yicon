import {
  FETCH_ALL_INFO,
  FETCH_SYSTEM_INFO,
  FETCH_PROJECT_INFO,
} from '../../constants/actionTypes';

const initialState = {
  currentTag: '',
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
    count = item.userLog.unread ?
    count + 1 :
    '';
  });
  return count;
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_INFO: {
      const count = countUnreadItem(action.payload);
      const totalCount = count + state.systemInfo.unReadCount + state.projectInfo.unReadCount;
      return {
        ...state,
        unReadCount: totalCount,
        allInfo: {
          unReadCount: count,
          list: action.payload,
        },
      };
    }
    case FETCH_SYSTEM_INFO: {
      const count = countUnreadItem(action.payload);
      const totalCount = count + state.systemInfo.unReadCount + state.projectInfo.unReadCount;
      return {
        ...state,
        unReadCount: totalCount,
        systemInfo: {
          unReadCount: count,
          list: action.payload,
        },
      };
    }
    case FETCH_PROJECT_INFO: {
      const count = countUnreadItem(action.payload);
      const totalCount = count + state.systemInfo.unReadCount + state.projectInfo.unReadCount;
      return {
        ...state,
        unReadCount: totalCount,
        projectInfo: {
          unReadCount: count,
          list: action.payload,
        },
      };
    }

    default:
      return state;
  }
};
