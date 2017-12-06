import React from 'react';
import PropTypes from 'prop-types';
import {pickBy, debounce} from 'lodash/fp';
import {camelizeKeys} from 'humps';
import {connect} from 'react-redux';

import containers from 'styles/containers';
import Select from 'components/Select.component';

@connect(state => ({location: state.util.location}))
export default class LocationInput extends React.Component {
  static propTypes = {
    radius: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    componentRestrictions: PropTypes.object,
    types: PropTypes.array,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    updateDelay: PropTypes.number,
    value: PropTypes.string
  };
  static defaultProps = {
    updateDelay: 300,
    types: ['address'],
    radius: 20,
    componentRestrictions: {country: 'FI'}
  };
  constructor(props) {
    super(props);
    this.state = {
      address: {},
      options: props.value ? [{value: props.value}] : [],
      loading: !!props.value,
      value: props.value
    };
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.resetInput(props, props.value ? undefined : state => this.state = state); // eslint-disable-line
  };
  componentWillReceiveProps(newProps) {
    if (
      newProps.value !== this.props.value &&
      newProps.value !== this.state.value
    ) {
      this.resetInput(newProps);
    }
  }
  resetInput = ({value}, updateState = state => this.setState(state)) => value ?
    this.geocoder.geocode({placeId: value}, ([result], status) =>
      status === google.maps.GeocoderStatus.OK ?
        updateState({
          value,
          options: [{label: result.formatted_address, value}],
          loading: false
        })
        : updateState({value: null, options: [], loading: false})
    )
    : updateState({value, options: [], loading: false});
  getAddressData = placeId =>
    new Promise((resolve, reject) => placeId || this.state.value ?
      this.geocoder.geocode({placeId: placeId || this.state.value.value}, ([result], status) =>
        status === google.maps.GeocoderStatus.OK ?
          resolve(camelizeKeys(result.address_components.reduce((prev, curr) =>
            Object.assign({}, prev, curr.types.reduce((types, type) =>
              Object.assign({}, types, {[type]: curr.long_name}), {})
            ), {
            placeId: placeId || this.state.value.value,
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng()
          }
          )))
          : reject(status)
      ) : resolve({})
    );
  handleChange = async(v) => {
    const {value} = v || {};
    this.setState({value, address: value ? await this.getAddressData(value) : {}});
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({value, address: this.state.address});
    }
  };
  handleLoadOptions = debounce(this.props.updateDelay)(async(input) => {
    if (!input) {
      return this.setState({options: [], loading: false});
    }
    const {radius, location, types, componentRestrictions} = this.props;
    this.setState({loading: true});
    const options = pickBy(o => o)(
      Object.assign({input, types, componentRestrictions},
        radius && navigator.geolocation ? {
          location: new google.maps.LatLng(
            location.latitude,
            location.longitude
          ),
          radius
        } : {}
      )
    );
    const suggestions = await new Promise(resolve =>
      this.autocompleteService.getPlacePredictions(options, suggestions =>
        resolve(suggestions)
      )
    );
    this.setState({
      loading: false,
      options: suggestions ? suggestions.map(suggestion => ({
        label: suggestion.description,
        value: suggestion.place_id
      })) : []
    });
  });
  render() {
    const {
      loading,
      options,
      address: {route = '', streetNumber = '', country = '', postalCode = '', locality = ''} = {}
    } = this.state;
    const {placeholder} = this.props;
    return (
      <div>
        <div>
          <Select
            autoBlur
            clearable
            id='location'
            isLoading={loading}
            onChange={this.handleChange}
            onInputChange={this.handleLoadOptions}
            options={options}
            placeholder={placeholder}
            value={this.state.value}
          />
        </div>
        <div style={containers.informationContainer}>
          {route ? `${route} ${streetNumber}` : null}
          {postalCode || locality ? `${postalCode} ${locality}`.trim() : null}
          {country || null}
        </div>
      </div>
    );
  }
}
