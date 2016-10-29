import ApolloClient, {createNetworkInterface} from 'apollo-client';
import Cookie from 'js-cookie';

import config from 'config';

const networkInterface = createNetworkInterface({
  uri: `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.graphQL.endpoint}`
});

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    const token = Cookie.get('Authorization');
    if (token) {
      req.options.headers.Authorization = `Bearer ${token}`;
    }
    next();
  }
}]);

const apolloClient = new ApolloClient({
  networkInterface,
  shouldBatch: true
});

export default apolloClient;
