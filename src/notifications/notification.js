// @flow
import {List, Map} from 'immutable';

const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';

export default (state: List<Map<string, *> > = new List(), action: Object) =>
  action.type === ADD_NOTIFICATION ? state.push(action.payload)
  : action.type === DELETE_NOTIFICATION ?
    state.filterNot((notification: Map<string, *> ) =>
      action.payload === notification
    )
  : action.type === CLEAR_NOTIFICATIONS ? state.clear()
  : state;

export const addNotification = (payload: Map<string, *> | Object) => ({
  type: ADD_NOTIFICATION,
  payload: (payload instanceof Map ? payload : new Map(payload))
    .set('time', Date.now())
});

export const clearNotifications = () => ({
  type: CLEAR_NOTIFICATIONS
});

export const deleteNotification = (payload: Map<string, *> ) => ({
  type: DELETE_NOTIFICATION,
  payload
});
