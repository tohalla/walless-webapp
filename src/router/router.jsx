import React from 'react';
import {
  Router,
  Route,
  IndexRoute,
  browserHistory
} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';

import Root from 'containers/Root.component';
import Home from 'pages/Home.component';
import store from 'store';
import restaurant from 'router/restaurant.routes';


const history = syncHistoryWithStore(
  browserHistory,
  store,
  {selectLocationState: state => state.util.routing}
);

export default class extends React.Component {
  shouldComponentUpdate = () => false;
  render() {
    return (
      <Router history={history}>
        <Route component={Root} path="/">
          <IndexRoute component={Home} />
            {restaurant}
          <Route path="documentation" />
          <Route path="contact" />
          <Route path="settings" />
        </Route>
      </Router>
    );
  }
}
