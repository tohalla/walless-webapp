import {equals} from 'lodash/fp';

const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';

export default (state = [], action) =>
  action.type === ADD_NOTIFICATION ? state.concat(action.payload)
    : action.type === DELETE_NOTIFICATION ?
      state.filter((notification) => !equals(action.payload)(notification))
      : action.type === CLEAR_NOTIFICATIONS ? []
        : state;

export const addNotification = (payload) => ({
  type: ADD_NOTIFICATION,
  payload: Object.assign(
    {},
    payload,
    {time: Date.now()}
  )
});

export const clearNotifications = () => ({
  type: CLEAR_NOTIFICATIONS
});

export const deleteNotification = (payload) => ({
  type: DELETE_NOTIFICATION,
  payload
});
