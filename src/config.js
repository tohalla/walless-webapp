const url = process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost';
const port = process.env.NODE_ENV === 'production' ? 8080 : 8080;

export default {
  api: {
    url,
    port,
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
    url,
    port,
    protocol: process.env.NODE_ENV === 'production' ? 'wss' : 'ws',
    endpoint: undefined
  }
};
