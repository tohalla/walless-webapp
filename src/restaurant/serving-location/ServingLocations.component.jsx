import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';

import {
  getServingLocationsByRestaurant
} from 'graphql/restaurant/restaurant.queries';
import ServingLocation from 'restaurant/serving-location/ServingLocation.component';

const mapStateToProps = state => ({t: state.util.translation.t});

class ServingLocations extends React.Component {
  static PropTypes = {
    restaurant: React.PropTypes.object.isRequired
  }
  render() {
    const {
      getServingLocationsByRestaurant: {servingLocations} = {}
    } = this.props;
    return (
      <div className="container container--distinct">
        {servingLocations && servingLocations.length ?
           servingLocations.map((servingLocation, index) =>
            <ServingLocation
                key={index}
                servingLocation={servingLocation}
            />
          )
          : ''
        }
      </div>
    );
  }
}

export default compose(getServingLocationsByRestaurant)(
  connect(mapStateToProps, {})(ServingLocations)
);
