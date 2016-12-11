import {createStore, combineReducers, applyMiddleware, compose} from 'redux';

import apolloClient from 'apolloClient';
import DevTools from 'DevTools';
import notifications from 'notifications/notification';

const store = createStore(
  combineReducers({
    apollo: apolloClient.reducer(),
    notifications
  }),
  {},
  compose(
    applyMiddleware(apolloClient.middleware()),
    process.env.NODE_ENV === 'production' ?
      f => f : DevTools.instrument()
  )
);


export default store;
