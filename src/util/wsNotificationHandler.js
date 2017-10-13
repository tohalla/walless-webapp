import Cookie from 'js-cookie';
import {subscribe} from 'walless-graphql';
import io from 'socket.io-client';

import config from 'config';
import client from 'apolloClient';

export const initializeNotificationHandler = async ({headers}) =>
  subscribe(
    {
      socket: io(
        `${config.websocket.protocol}://${config.websocket.url}${config.api.port === 80 ? '' : `:${config.api.port}`}/restaurant`,
        {
          transportOptions: {
            polling: {
              extraHeaders: Object.assign({
                authorization: await Cookie.get('ws-token')
              }, headers)
            }
          }
        }
      ),
      client
    },
    ({newRecord, oldRecord, target, operations}) =>
      target.toLowerCase() === 'order' ?
        true
      : null
  );
