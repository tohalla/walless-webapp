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
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';

import Root from './containers/Root.component';
import Home from './pages/Home.component';
import Restaurant from './pages/Restaurant.container';
import {updateTranslations} from './util/translation';
import TranslationWrapper from './util/TranslationWrapper.component';
import config from '../config';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.graphQL.endpoint}`
  })
});

ReactDOM.render((
  <TranslationWrapper polyglot={updateTranslations('en')}>
    <ApolloProvider client={client}>
    <Router history={browserHistory}>
      <Route
          component={Root}
          path="/"
      >
        <IndexRoute component={Home} />
        <Route
            component={Restaurant}
            path="restaurant"
        />
        <Route path="documentation" />
        <Route path="contact" />
      </Route>
    </Router>
    </ApolloProvider>
  </TranslationWrapper>
  ), document.getElementById('app')
);

import '../assets/styles/main.scss';
