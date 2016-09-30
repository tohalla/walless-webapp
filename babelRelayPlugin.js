/* eslint-disable import/no-commonjs, fp/no-mutation */
const babelRelayPlugin = require('babel-relay-plugin');
const introspectionQuery = require('graphql/utilities').introspectionQuery;
const request = require('sync-request');

const response = request('GET', 'http://localhost:8080/graphql', {
  qs: {
    query: introspectionQuery
  }
});

const schema = JSON.parse(response.body.toString('utf-8'));

module.exports = babelRelayPlugin(schema.data, {
  abortOnError: true
});
