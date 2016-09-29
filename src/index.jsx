// @flow
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Router,
  Route,
  // IndexRoute,
  browserHistory,
  applyRouterMiddleware,
  Redirect
} from 'react-router';
import useRelay from 'react-router-relay';
import Relay from 'react-relay';

import Default from './containers/Default.component';

import {updateTranslations} from './internalization';

updateTranslations('en');

ReactDOM.render((
  <Router
      environment={Relay.Store}
      history={browserHistory}
      render={applyRouterMiddleware(useRelay)}
  >
    <Redirect from="/" to="/home" />
    <Route
        component={Default}
        path="/"
    >
      <Route path="home" />
      <Route path="restaurant" />
      <Route path="settings" />
    </Route>
  </Router>
  ), document.getElementById('app')
);

import 'material-design-lite/material.js';
import 'normalize.css/normalize.css';

import '../assets/styles/main.scss';
