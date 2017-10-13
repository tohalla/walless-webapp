export default {
  api: {
    url: process.env.NODE_ENV === 'production' ?
      'api.walless.fi' : 'localhost',
    port: process.env.NODE_ENV === 'production' ? 80 : 8080,
    protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
    graphQL: {
      endpoint: 'graphql'
    },
    translation: {
      endpoint: 'translation'
    },
    authentication: {
      endpoint: 'auth'
    },
    upload: {
      endpoint: 'upload'
    },
    servingLocation: {
      endpoint: 'serving-location'
    }
  },
  websocket: {
    url: process.env.NODE_ENV === 'production' ?
      'api.walless.fi' : 'localhost',
    port: process.env.NODE_ENV === 'production' ? 80 : 8080,
    protocol: process.env.NODE_ENV === 'production' ? 'wss' : 'ws',
    endpoint: undefined
  }
};
