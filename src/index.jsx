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

import Root from './containers/Root.component';
import Home from './pages/Home.component';
import {updateTranslations} from './util/translation';
import TranslationWrapper from './util/TranslationWrapper.component';
import config from '../config';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(
    `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.graphQL.endpoint}`
  )
);

ReactDOM.render((
  <TranslationWrapper polyglot={updateTranslations('en')}>
    <Router
        environment={Relay.Store}
        history={browserHistory}
        render={applyRouterMiddleware(useRelay)}
    >
      <Route
          component={Root}
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
