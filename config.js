export default {
  api: {
    url: process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost',
    port: process.env.NODE_ENV === 'production' ? 8080 : 8080,
    protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
    graphQL: {
      endpoint: 'graphql'
    },
    authentication: {
      endpoint: 'auth'
    }
  }
};
