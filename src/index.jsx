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
import RestaurantPage from 'pages/Restaurant.component';
import Menu from 'restaurant/menu/Menu.component';
import MenuItem from 'restaurant/menu-item/MenuItem.component';
import Menus from 'restaurant/menu/Menus.component';
import MenuItems from 'restaurant/menu-item/MenuItems.component';
import Restaurant from 'restaurant/Restaurant.component';
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
            component={RestaurantPage}
            onEnter={requireAuthentication}
            path="restaurant(/:restaurant)"
        >
          <IndexRoute component={Restaurant} />
          <Route path="menus">
            <IndexRoute component={Menus} />
            <Route
                component={routeParamWrapper(Menu, ['menu'], {expand: true})}
                path=":menu"
            />
          </Route>
          <Route path="menuitems">
            <IndexRoute component={MenuItems} />
            <Route
                component={
                  routeParamWrapper(MenuItem, ['menuItem'], {expand: true})
                }
                path=":menuItem"
            />
          </Route>
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
