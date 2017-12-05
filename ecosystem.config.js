/* eslint-disable import/no-commonjs */
module.exports = {
  apps: [{
    name: 'walless',
    script: './server.js',
    watch: false,
    instance_var: 'INSTANCE_ID',
    env: {
      PORT: 3000,
      NODE_ENV: 'production'
    }
  }]
};
