import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {routerReducer} from 'react-router-redux';
import {reducer as form} from 'redux-form';

import apolloClient from 'apolloClient';
import DevTools from 'DevTools';
import notifications from 'notifications/notification';
import translation, {fetchLanguages} from 'util/translation';

const util = combineReducers({
  translation,
  routing: routerReducer
});

const store = createStore(
  combineReducers({
    apollo: apolloClient.reducer(),
    notifications,
    util,
    form
  }),
  {},
  compose(
    applyMiddleware(apolloClient.middleware(), thunk),
    process.env.NODE_ENV === 'production' ?
      f => f : DevTools.instrument()
  )
);

store.dispatch(fetchLanguages);

export default store;
