import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {routerReducer} from 'react-router-redux';
import {reducer as form} from 'redux-form';

import apolloClient from 'apolloClient';
import DevTools from 'DevTools';
import notifications from 'notifications/notification';
import translation, {fetchLanguages} from 'util/translation';
import location, {updateLocation} from 'util/location';

const util = combineReducers({
  translation,
  location,
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
store.dispatch(updateLocation);

export default store;
