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
import TabbedPage from './containers/TabbedPage.component';
import {updateTranslations} from './util/translation';
import TranslationWrapper from './util/TranslationWrapper.component';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:8080/graphql')
);

ReactDOM.render((
  <TranslationWrapper polyglot={updateTranslations('en')}>
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
        <Route component={TabbedPage} path="restaurant" />
        <Route component={TabbedPage} path="documentation" />
        <Route path="contact" />
      </Route>
    </Router>
  </TranslationWrapper>
  ), document.getElementById('app')
);

import '../assets/styles/main.scss';
