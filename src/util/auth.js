// @flow
import Cookie from 'js-cookie';
import fetch from 'isomorphic-fetch';

import config from 'config';

export const authenticate = async(payload: Object) => {
  const response = await fetch(
    `${config.api.protocol}://${config.api.url}${
      config.api.port === 80 ? '' : `:${config.api.port}`
    }/${config.api.authentication.endpoint}/${
      payload.token ? 'renewToken' : ''
    }`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'authorization': payload.token
      },
      body: payload.token ? undefined : JSON.stringify(payload)
    }
  );
  if (response.status === 200) {
    return response;
  }
  throw new Error(await response.json());
};

const authenticationHandler = {
  isAuthenticated: Boolean(Cookie.get('authorization')),
  renew: (token: string) => authenticate({token}),
  logout: () => {
    Cookie.remove('authorization', {path: ''});
    Cookie.remove('ws-token', {path: ''});
    Cookie.remove('expiration', {path: ''});
    window.location.replace('/');
  }
};

setInterval(() => {
  if (Cookie.get('expiration') && Cookie.get('authorization')) {
    const age = Cookie.get('expiration') - Date.now() / 1000;
    if (age < 0) {
      authenticationHandler.logout();
    } else if (age < 600) {
      authenticationHandler.renew(Cookie.get('authorization'));
    }
  }
}, 20000); // checks if authorization token should be renewed

export default authenticationHandler;
