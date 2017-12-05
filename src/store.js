import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import notifications from 'notifications/notification';
import location, {updateLocation} from 'util/location';

const util = combineReducers({
  location
});

const store = createStore(
  combineReducers({
    notifications,
    util
  }),
  {},
  compose(
    applyMiddleware(thunk)
  )
);

(async () => await Promise.all([
  store.dispatch(updateLocation)
]))();

export default store;
