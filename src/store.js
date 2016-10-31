import {createStore, combineReducers, applyMiddleware, compose} from 'redux';

import apolloClient from 'apolloClient';
import DevTools from 'DevTools';

const store = createStore(
  combineReducers({
    apollo: apolloClient.reducer()
  }),
  {},
  compose(
    applyMiddleware(apolloClient.middleware()),
    process.env.NODE_ENV === 'production' ?
      f => f : DevTools.instrument()
  )
);


export default store;
