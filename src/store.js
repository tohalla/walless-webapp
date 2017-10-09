import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import apolloClient from 'apolloClient';
import notifications from 'notifications/notification';
import translation, {fetchLanguages, setLanguage} from 'util/translation';
import location, {updateLocation} from 'util/location';

const util = combineReducers({
  translation,
  location
});

const store = createStore(
  combineReducers({
    apollo: apolloClient.reducer(),
    notifications,
    util
  }),
  {},
  compose(
    applyMiddleware(apolloClient.middleware(), thunk)
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
