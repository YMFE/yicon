import {
  LAUNCH_REDUX_DEVTOOLS,
} from '../constants/actionTypes';

export function launchDevTools() {
  return { type: LAUNCH_REDUX_DEVTOOLS };
}
