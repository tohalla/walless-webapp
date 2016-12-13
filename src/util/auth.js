// @flow
import Cookie from 'js-cookie';

import config from 'config';

export const authenticate = async (email: string, password: string) => {
  const response = await fetch(
    `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.authentication.endpoint}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );
  if (response.status === 200) {
    return (await response.json()).token;
  }
  throw new Error(await response.json());
};

function AuthenticationHandler() {
  this.isAuthenticated = Boolean(Cookie.get('Authorization'));
  this.authenticate = async (email: string, password: string) => {
    Cookie.remove('Authorization');
    const token = await authenticate(email, password);
    Cookie.set('Authorization', token);
    window.location.reload();
  };
  this.logout = async () => {
    Cookie.remove('Authorization');
    window.location.reload();
  };
};

const authenticationHandler = new AuthenticationHandler();

export default authenticationHandler;
