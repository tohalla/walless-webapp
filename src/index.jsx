// @flow
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

import Root from 'containers/Root.component';
import Home from 'pages/Home.component';
import Restaurant from 'pages/Restaurant.container';
import {updateTranslations} from 'util/translation';
import TranslationWrapper from 'util/TranslationWrapper.component';
import apolloClient from 'apolloClient';

ReactDOM.render((
  <TranslationWrapper polyglot={updateTranslations('en')}>
    <ApolloProvider client={apolloClient}>
    <Router history={browserHistory}>
      <Route
          component={Root}
          path="/"
      >
        <IndexRoute component={Home} />
        <Route
            component={Restaurant}
            path="restaurant(/:restaurant)"
        >
          <Route path="settings" />
        </Route>
        <Route path="documentation" />
        <Route path="contact" />
      </Route>
    </Router>
    </ApolloProvider>
  </TranslationWrapper>
  ), document.getElementById('app')
);

import 'styles/main.scss';
