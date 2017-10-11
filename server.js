/* eslint-disable import/no-commonjs */
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');

const allowedRoles = [
  'restaurant_owner',
  'restaurant_employee',
  'moderator',
  'admin'
];

const proxy = require('http-proxy').createProxyServer();
const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.all('*', (req, res) => {
    proxy.web(req, res, {
      target: 'http://localhost:3001'
    });
  });
  require('./webpack')({
    before: app => {
      app.use(require('cookie-parser')());
      app.get(/^((?!(assets|favicon.icoch)).)*$/, async (req, res, next) => {
        const token = req.cookies['Authorization'];
        const {role} = token ? await jwt.verify(
          token.replace('Bearer ', ''),
          process.env.JWT_SECRET || 'd'
        ) : 'guest';
        if (
          req.path !== '/authentication.html' &&
          allowedRoles.indexOf(role) === -1
        ) {
          res.redirect('/authentication.html');
        } else if (
          req.path === '/authentication.html' &&
          allowedRoles.indexOf(role) !== -1
        ) {
          res.redirect('/');
        } else {
          next();
        }
      });
    }
  });
}

const server = require('http').createServer(app);

server.on('upgrade', (req, socket, head) =>
  proxy.ws(req, socket, head, {target: 'http://localhost:3001'})
);

server.listen(3000);
