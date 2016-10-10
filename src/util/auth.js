// @flow
import config from '../../config';

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
  return new Error(await response.json());
};

export const getActiveAccount = async (token: string) => {
  const response = await fetch(
    `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.authentication.endpoint}/account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        token
      })
    }
  );
  if (response.status === 200) {
    return await response.json();
  }
  return new Error(await response.json());
};
