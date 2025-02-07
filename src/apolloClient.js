import ApolloClient from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import Cookie from 'js-cookie';
import {util} from 'walless-graphql';

import authenticationHandler from 'util/auth';
import config from 'config';

const httpLink = createHttpLink({
  uri: `${config.api.protocol}://${config.api.url}${config.api.port === 80 ? '' : `:${config.api.port}`}/${config.api.graphQL.endpoint}`
});

const link = new ApolloLink((operation, forward) => {
  if (Cookie.get('expiration') < Date.now() / 1000) {
    authenticationHandler.logout();
  } else {
    operation.setContext({
      headers: {
        authorization: `Bearer ${Cookie.get('authorization')}`
      }
    });
    return forward(operation);
  }
}).concat(httpLink);

export default new ApolloClient({
  shouldBatch: true,
  dataIdFromObject: util.dataIdFromObject,
  queryDeduplication: true,
  link,
  cache: new InMemoryCache({
    dataIdFromObject: util.dataIdFromObject
  }).restore(window.__APOLLO_STATE__)
});
