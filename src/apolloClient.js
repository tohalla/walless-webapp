import ApolloClient, {createNetworkInterface} from 'apollo-client';
import Cookie from 'js-cookie';

import authenticationHandler from 'util/auth';
import config from 'config';

const networkInterface = createNetworkInterface({
  uri: `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.graphQL.endpoint}`
});

const dataIdFromObject = result =>
  result.nodeId;

const apolloClient = new ApolloClient({
  networkInterface,
  shouldBatch: true,
  dataIdFromObject,
  queryDeduplication: true
});

networkInterface.use([{
  async applyMiddleware(req, next) {
    if (Cookie.get('Expiration') < Date.now() / 1000) {
      await authenticationHandler.logout();
      await apolloClient.resetStore();
    } else {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      const token = Cookie.get('Authorization');
      if (token) {
        req.options.headers.Authorization = `Bearer ${token}`;
      }
    }
    next();
  }
}]);


export default apolloClient;
