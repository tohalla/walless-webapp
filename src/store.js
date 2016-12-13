import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import apolloClient from 'apolloClient';
import DevTools from 'DevTools';
import notifications from 'notifications/notification';
import translation from 'util/translation';

const util = combineReducers({
  translation
});

const store = createStore(
  combineReducers({
    apollo: apolloClient.reducer(),
    notifications,
    util
  }),
  {},
  compose(
    applyMiddleware(apolloClient.middleware(), thunk),
    process.env.NODE_ENV === 'production' ?
      f => f : DevTools.instrument()
  )
);


export default store;
