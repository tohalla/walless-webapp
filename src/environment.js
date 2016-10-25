import Relay from 'react-relay';
import {
  RelayNetworkLayer,
  retryMiddleware,
  authMiddleware,
  loggerMiddleware,
  urlMiddleware,
  gqErrorsMiddleware
} from 'react-relay-network-layer';
import Cookie from 'js-cookie';

import config from '../config';

const environment = new Relay.Environment();

environment.injectNetworkLayer(
  new RelayNetworkLayer([
    urlMiddleware({
      url: `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.graphQL.endpoint}`
    }),
    retryMiddleware({
      fetchTimeout: 15000,
      retryDelays: (attempt) => Math.pow(2, attempt + 4) * 100,
      statusCodes: [500, 503, 504]
    }),
    authMiddleware({
      token: () => Cookie.get('Authorization') || '',
      allowEmptyToken: true
    })
  ].concat(process.env.NODE_ENV === 'production' ? [] : [
    loggerMiddleware(),
    gqErrorsMiddleware()
  ]), {disableBatchQuery: true})
);

export default environment;
