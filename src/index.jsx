import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Router,
  Route,
  IndexRoute,
  browserHistory
} from 'react-router';
import {ApolloProvider} from 'react-apollo';
import {syncHistoryWithStore} from 'react-router-redux';

import Root from 'containers/Root.component';
import Home from 'pages/Home.component';
import Restaurant from 'pages/Restaurant.container';
import Menus from 'restaurant/Menus.container';
import MenuItems from 'restaurant/MenuItems.container';
import apolloClient from 'apolloClient';
import store from 'store';

const history = syncHistoryWithStore(
  browserHistory,
  store,
  {selectLocationState: state => state.util.routing}
);

ReactDOM.render((
  <ApolloProvider client={apolloClient} store={store}>
    <Router history={history}>
      <Route component={Root} path="/">
        <IndexRoute component={Home} />
        <Route component={Restaurant} path="restaurant(/:restaurant)">
          <Route component={Menus} path="menus" />
          <Route component={MenuItems} path="menuitems" />
          <Route path="settings" />
          <Route path="users" />
          <Route path="dashboard" />
        </Route>
        <Route path="documentation" />
        <Route path="contact" />
        <Route path="settings" />
      </Route>
    </Router>
  </ApolloProvider>
  ), document.getElementById('app')
);

import 'styles/main.scss';
