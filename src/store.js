import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {routerReducer} from 'react-router-redux';

import apolloClient from 'apolloClient';
import DevTools from 'DevTools';
import notifications from 'notifications/notification';
import translation, {fetchLanguages, setLanguage} from 'util/translation';
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
    util
  }),
  {},
  compose(
    applyMiddleware(apolloClient.middleware(), thunk),
    process.env.NODE_ENV === 'production' ?
      f => f : DevTools.instrument()
  )
);

(async() => {
  await Promise.all([
    store.dispatch(fetchLanguages),
    store.dispatch(updateLocation)
  ]);
  store.dispatch(setLanguage('en'));
})();

export default store;
