import isonFetch from 'isom-fetch';
import {
  FETCH_UPLOAD_EDIT_LOAD,
  FETCH_SUBMIT_EDIT_ICONS,
  GET_UPLOAD_SINGLE_ICON,
//  MODIFY_UPLOAD_SINGLE_ICON,
} from '../constants/actionTypes';
const fetch = isonFetch.create({ baseURL: '/api' });

function getRepoId(repoid) {
  return repoid;
}
function getIconList(icons) {
  return icons.map((item) => ({
    id: item.id,
    name: item.name,
  }));
}
// 进入页面 渲染 要上传的所有图标信息
export function fetchUploadEditLoad() {
  return {
    type: FETCH_UPLOAD_EDIT_LOAD,
    payload: fetch.get('/icons'), // 接口待定
  };
}

// 参数待定
/* {
    "repoId": 3,
    "icons": [
        {
            "id": 12,
            "name": "呵呵",
            "tags": "酒杯,酒杯,呵呵",
            "style": "-o",
        },
        {
            "id": 12,
            "name": "呵呵",
            "tags": "酒杯,酒杯,呵呵",
            "style": "-o",
        }
    ]
} */
export function fetchSubmitEditLoad(id, icons) {
  return {
    type: FETCH_SUBMIT_EDIT_ICONS,
    payload: fetch.post('/user/icons', {
      repoId: getRepoId(id),
      icons: getIconList(icons),
    }),
  };
}

// 获取单个图标信息
export function getUploadSingleIcon(id) {
  return {
    type: GET_UPLOAD_SINGLE_ICON,
    payload: fetch.get(`/user/icons/${id}`), // 接口待定
  };
}
// 修改单个图标信息  PATCH  方式的 暂时不会写  要看看文档啊
// export function ModifyUploadSingleIcon(id) {
//   return {
//     type: MODIFY_UPLOAD_SINGLE_ICON,
//     payload: fetch.get(`/user/icons/${id}`), // 接口待定
//   };
// }

// 删除暂存台中的单个图标信息 待定
