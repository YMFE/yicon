import isonFetch from 'isom-fetch';
import {
  FETCH_ICON_STATISTIC,
} from '../constants/actionTypes';

const fetch = isonFetch.create({
  baseURL: '/api',
});

export function fetchIconStatistic(size, number) {
  return {
    type: FETCH_ICON_STATISTIC,
    payload: fetch.get(`/statistics/size/${size}/number/${number}`),
  };
}
