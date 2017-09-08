// @flow
import Cookie from 'js-cookie';
import fetch from 'isomorphic-fetch';

import config from 'config';

export const authenticate = async(payload: Object) => {
  const response = await fetch(
    `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.authentication.endpoint}/${payload.token ? 'renewToken' : ''}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'authorization': payload.token
      },
      body: payload.token ? null : JSON.stringify(payload)
    }
  );
  if (response.status === 200) {
    return (await response.json());
  }
  throw new Error(await response.json());
};

const authenticationHandler = {
  isAuthenticated: Boolean(Cookie.get('Authorization')),
  authenticate: async(email: string, password: string) => {
    Cookie.remove('Authorization');
    Cookie.remove('ws-token');
    Cookie.remove('Expiration');
    const authorization = await authenticate({email, password});
    Cookie.set('Authorization', authorization.token);
    Cookie.set('ws-token', authorization.wsToken);
    Cookie.set('Expiration', authorization.expiresAt);
  },
  renew: async(token: string) => {
    const authorization = await authenticate({token});
    Cookie.set('Authorization', authorization.token);
    Cookie.set('ws-token', authorization.wsToken);
    Cookie.set('Expiration', authorization.expiresAt);
  },
  logout: async() => {
    Cookie.remove('Authorization');
    Cookie.remove('ws-token');
    Cookie.remove('Expiration');
  }
};

setInterval(() => {
  if (
    Cookie.get('Expiration') &&
    Cookie.get('Authorization')
  ) {
    const age = Cookie.get('Expiration') - Date.now() / 1000;
    if (age < 0) {
      authenticationHandler.logout();
    } else if (age < 600) {
      authenticationHandler.renew(Cookie.get('Authorization'));
    }
  }
}, 20000); // checks if authorization token should be renewed

export default authenticationHandler;

export const requireAuthentication = (nextState: Object, replace: Function) => {
  if (!Cookie.get('Authorization')) {
    replace('/');
  }
};
