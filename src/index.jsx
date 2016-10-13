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

import environment from './environment';
import Root from './containers/Root.component';
import Home from './pages/Home.component';
import Restaurant from './pages/Restaurant.container';
import restaurantQueries from './pages/restaurant.queries';
import {updateTranslations} from './util/translation';
import TranslationWrapper from './util/TranslationWrapper.component';

ReactDOM.render((
  <TranslationWrapper polyglot={updateTranslations('en')}>
    <Router
        environment={environment}
        history={browserHistory}
        render={applyRouterMiddleware(useRelay)}
    >
      <Route
          component={Root}
          path="/"
      >
        <IndexRoute component={Home} />
        <Route
            component={Restaurant}
            path="restaurant"
            queries={restaurantQueries}
        />
        <Route path="documentation" />
        <Route path="contact" />
      </Route>
    </Router>
  </TranslationWrapper>
  ), document.getElementById('app')
);

import '../assets/styles/main.scss';
