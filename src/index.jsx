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
import Menu from 'restaurant/Menu.component';
import Menus from 'restaurant/Menus.container';
import MenuItems from 'restaurant/MenuItems.container';
import apolloClient from 'apolloClient';
import store from 'store';
import routeParamWrapper from 'util/routeParamWrapper';
import {requireAuthentication} from 'util/auth';

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
        <Route
            component={Restaurant}
            onEnter={requireAuthentication}
            path="restaurant(/:restaurant)"
        >
          <Route path="menus">
            <IndexRoute component={Menus} />
            <Route
                component={routeParamWrapper(Menu, ['menu'], {expand: true})}
                path=":menu"
            />
          </Route>
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
