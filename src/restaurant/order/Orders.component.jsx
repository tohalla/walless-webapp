import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {get} from 'lodash/fp';

import {getOrdersByRestaurant} from 'walless-graphql/restaurant/restaurant.queries';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  language: state.util.translation.language,
  filter: get(['form', 'orderFilter', 'values'])(state)
});

class Orders extends React.Component {
  static PropTypes = {
    restaurant: PropTypes.object.isRequired
  };
  render() {
    return (
      <div />
    );
  }
}

export default compose(
  connect(mapStateToProps, {}),
  getOrdersByRestaurant
)(Orders);
