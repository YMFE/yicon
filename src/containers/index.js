import App from './App/App';
import DevTools from './DevTools/DevTools';
import Home from './Home/Home';
import Demo from './Demo/Demo';
import Project from './Project/Project';
import NoMatch from './NoMatch/NoMatch';
import Repository from './Repository/Repository';
import Search from './Search/Search';
import Notification from './Notification/Notification';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

export {
  App,
  DevTools,
  Demo,
  Home,
  NoMatch,
  Project,
  Repository,
  Search,
  Notification,
};
