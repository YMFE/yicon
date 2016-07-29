import App from './App/App';
import DevTools from './DevTools/DevTools';
import Home from './Home/Home';
import Demo from './Demo/Demo';
import Upload from './Upload/Upload';
import UploadEdit from './UploadEdit/UploadEdit';
import Project from './Project/Project';
import NoMatch from './NoMatch/NoMatch';
import Repository from './Repository/Repository';
import Search from './Search/Search';
import Notification from './Notification/Notification';
import Transition from './Transition/Transition';
import Uploaded from './Uploaded/Uploaded';
import Log from './Log/Log';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

export {
  App,
  DevTools,
  Demo,
  Upload,
  UploadEdit,
  Home,
  Log,
  NoMatch,
  Project,
  Repository,
  Transition,
  Search,
  Notification,
  Uploaded,
};
