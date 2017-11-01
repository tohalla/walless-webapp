import {Provider} from 'react-redux';
import {ApolloProvider} from 'react-apollo';

import apolloClient from 'apolloClient';
import Router from 'Router';
import store from 'store';

export default (
  <Provider store={store}>
    <ApolloProvider client={apolloClient}>
      <Router />
    </ApolloProvider>
  </Provider>
);
