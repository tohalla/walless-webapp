import Cookie from 'js-cookie';

import subscribe from 'walless-graphql/subscribe';
import config from 'config';
import client from 'apolloClient';

export const initializeNotificationHandler = async ({headers}) =>
  subscribe(
    {
      url: `${config.websocket.protocol}://${config.websocket.url}:${config.websocket.port}/restaurant`,
      headers: Object.assign({
        authorization: await Cookie.get('ws-token')
      }, headers),
      client
    },
    ({newRecord, oldRecord, target, operations}) =>
      target.toLowerCase() === 'order' ?
        true
      : null
  );
