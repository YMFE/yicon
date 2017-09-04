import {
  FETCH_UNREAD_COUNT,
  FETCH_ALL_INFO,
  FETCH_SYSTEM_INFO,
  FETCH_PROJECT_INFO,
  FETCH_UNREAD_INFO,
  FETCH_INFO_DETAIL,
  SET_POLLING_ID,
  SET_INFO_READED,
  SUBMIT_PUBLICK_PROJECT,
  PUBLIC_PROJECT_LIST,
  AGREE_PUBLIC_PROJECT,
} from '../../constants/actionTypes';

const initialState = {
  unReadCount: 0,
  systemUnReadCount: 0,
  projectUnReadCount: 0,
  allInfo: {
    list: [],
    totalPage: 1,
    currentPage: 1,
  },
  systemInfo: {
    list: [],
    totalPage: 1,
    currentPage: 1,
  },
  projectInfo: {
    list: [],
    totalPage: 1,
    currentPage: 1,
  },
  unreadInfo: {
    list: [],
    totalPage: 1,
    currentPage: 1,
  },
  abc: '',
  infoDetail: {},
  pollingId: null,
  agreeProject: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_INFO: {
      if (action.payload.res) {
        return {
          ...state,
          allInfo: {
            list: action.payload.data,
            totalPage: action.payload.page.totalCount,
            currentPage: action.payload.page.currentPage,
          },
        };
      }
      return state;
    }
    case FETCH_SYSTEM_INFO: {
      if (action.payload.res) {
        return {
          ...state,
          systemInfo: {
            list: action.payload.data,
            totalPage: action.payload.page.totalCount,
            currentPage: action.payload.page.currentPage,
          },
        };
      }
      return state;
    }
    case FETCH_PROJECT_INFO: {
      if (action.payload.res) {
        return {
          ...state,
          projectInfo: {
            list: action.payload.data,
            totalPage: action.payload.page.totalCount,
            currentPage: action.payload.page.currentPage,
          },
        };
      }
      return state;
    }
    case FETCH_UNREAD_INFO: {
      if (action.payload.res) {
        return {
          ...state,
          unreadInfo: {
            list: action.payload.data,
            totalPage: action.payload.page.totalCount,
            currentPage: action.payload.page.currentPage,
          },
        };
      }
      return state;
    }
    case FETCH_UNREAD_COUNT: {
      const { type, number } = action.payload.data;
      let data = null;
      switch (type) {
        case 'all':
          data = {
            ...state,
            unReadCount: number,
          };
          break;
        case 'system':
          data = {
            ...state,
            systemUnReadCount: number,
          };
          break;
        case 'project':
          data = {
            ...state,
            projectUnReadCount: number,
          };
          break;
        default:
          data = state;
      }
      return data;
    }
    case FETCH_INFO_DETAIL: {
      if (action.payload.res) {
        const id = action.payload.data.id;
        const infoDetail = Object.assign({}, state.infoDetail);
        infoDetail[id] = action.payload.data;
        return {
          ...state,
          infoDetail,
        };
      }
      return state;
    }
    case SET_POLLING_ID: {
      return {
        ...state,
        pollingId: action.payload || null,
      };
    }
    case SET_INFO_READED: {
      // 更新数据状态
      const { id, scope, type } = action.payload || {};
      let data = null;
      const info = state[`${type}Info`];
      const list = info && info.list.map(val => {
        if (val.id === id) {
          const temp = val;
          temp.userLog.unread = false;
          return temp;
        }
        return val;
      });
      info.list = list;
      switch (type) {
        case 'all':
          data = {
            ...state,
            unReadCount: state.unReadCount - 1 || 0,
            allInfo: info,
          };
          data[`${scope}UnReadCount`] = data[`${scope}UnReadCount`] - 1;
          break;
        case 'system':
          data = {
            ...state,
            unReadCount: state.unReadCount - 1 || 0,
            systemUnReadCount: state.systemUnReadCount - 1,
            systemInfo: info,
          };
          break;
        case 'project':
          data = {
            ...state,
            unReadCount: state.unReadCount - 1 || 0,
            projectUnReadCount: state.projectUnReadCount - 1,
            projectInfo: info,
          };
          break;
        case 'unread':
          data = {
            ...state,
            unReadCount: state.unReadCount - 1 || 0,
            unreadInfo: info,
          };
          data[`${scope}UnReadCount`] = data[`${scope}UnReadCount`] - 1;
          break;
        default:
          data = state;
      }
      return data;
    }
    case SUBMIT_PUBLICK_PROJECT: {
      return {
        ...state,
        abc: action.payload,
      };
    }
    case PUBLIC_PROJECT_LIST: {
      return {
        ...state,
        publicList: action.payload,
      };
    }
    case AGREE_PUBLIC_PROJECT: {
      return {
        ...state,
        agreeProject: action.payload,
      };
    }
    default:
      return state;
  }
};
