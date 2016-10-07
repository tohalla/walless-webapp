// @flow
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Router,
  Route,
  IndexRoute,
  browserHistory,
  applyRouterMiddleware
} from 'react-router';
import useRelay from 'react-router-relay';
import Relay from 'react-relay';

import Default from './containers/Default.component';
import Home from './pages/Home.component';
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
      <Route
          component={Default}
          path="/"
      >
        <IndexRoute component={Home} />
        <Route path="restaurant" />
        <Route path="documentation" />
        <Route path="contact" />
      </Route>
    </Router>
  </TranslationWrapper>
  ), document.getElementById('app')
);

import '../assets/styles/main.scss';
