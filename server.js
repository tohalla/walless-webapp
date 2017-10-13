/* eslint-disable import/no-commonjs */
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const compression = require('compression');

const allowedRoles = [
  'restaurant_owner',
  'restaurant_employee',
  'moderator',
  'admin'
];

const proxy = require('http-proxy').createProxyServer();
const app = express();

const prod = process.env.NODE_ENV === 'production';

const handleRequests = app => {
  app
    .use(require('cookie-parser')())
    .get('/assets/app.js', (req, res, next) => {
      if (prod) {
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
      }
      next();
    })
    .use(compression({
      filter: (req, res) =>
        (prod && !req.url.endsWith('.gz')) || compression.filter(req, res)
    }))
    .get(/^(.*\.(?!(png|jpg|svg|js|gz|pdf|css|zip|ttf)$))?[^.]*$/, async (req, res, next) => {
      try {
        const token = req.cookies['Authorization'];
        const {role} = token ? await jwt.verify(
          token.replace('Bearer ', ''),
          process.env.JWT_SECRET || 'd'
        ) : 'guest';
        const authorized = allowedRoles.indexOf(role) !== -1;
        if (req.path !== '/authentication.html' && !authorized) {
          res.redirect('/authentication.html');
        } else if (req.path === '/authentication.html' && authorized) {
          res.redirect('/');
        } else if (prod && authorized) {
          res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
        } else {
          next();
        }
      } catch (error) {
        if (req.path !== '/authentication.html') {
          res.redirect('/authentication.html');
        } else {
          next();
        }
      }
    })
    .use(prod ?
      express.static(path.resolve(__dirname, 'dist'))
      : (req, res, next) => next()
    );
};

if (prod) {
  handleRequests(app);
  app
    .get('*', (req, res, netx) =>
      res.sendFile(path.resolve(__dirname, 'dist', 'authentication.html'))
    );
} else {
  app.all('*', (req, res) => {
    proxy.web(req, res, {
      target: 'http://localhost:3001'
    });
  });
  require('./webpack')({
    before: handleRequests
  });
}

const server = app.listen(3000);

if (!prod) {
  server.on('upgrade', (req, socket, head) =>
    proxy.ws(req, socket, head, {target: 'http://localhost:3001'})
  );
}
