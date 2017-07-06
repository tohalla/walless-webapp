// @flow
const SET_LOCATION = 'SET_LOCATION';

const initialState = {latitude: null, longitude: null};

export default (state: Object = initialState, action: Object) =>
  action.type === SET_LOCATION ?
    Object.assign({}, state, action.payload)
  : state;

export const updateLocation = async(dispatch: Function) =>
  navigator.geolocation ? navigator.geolocation.getCurrentPosition(position =>
    dispatch({
      type: SET_LOCATION,
      payload: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    })
  ) : dispatch({type: SET_LOCATION, payload: initialState});
