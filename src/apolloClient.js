import ApolloClient, {createNetworkInterface} from 'apollo-client';
import Cookie from 'js-cookie';

import authenticationHandler from 'util/auth';
import config from 'config';

const networkInterface = createNetworkInterface({
  uri: `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.graphQL.endpoint}`
});

networkInterface.use([{
  applyMiddleware(req, next) {
    if (Cookie.get('expiresAt') < Date.now() / 1000) {
      authenticationHandler.logout;
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

const dataIdFromObject = result =>
  result.id && result.__typename ?
    result.__typename + result.id : null;

const apolloClient = new ApolloClient({
  networkInterface,
  shouldBatch: true,
  dataIdFromObject
});

export default apolloClient;
