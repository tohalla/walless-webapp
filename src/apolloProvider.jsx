import React from 'react';
import {ApolloProvider} from 'react-apollo';

import apolloClient from 'apolloClient';
import Router from 'Router';
import store from 'store';


export default (
  <ApolloProvider client={apolloClient} store={store}>
    <Router />
  </ApolloProvider>
);
