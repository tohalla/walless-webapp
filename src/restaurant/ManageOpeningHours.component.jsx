import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';

@translate()
export default class ManageOpeningHours extends React.Component {
  static propTypes = {
    restaurant: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object
    ]).isRequired,
    openingHours: PropTypes.arrayOf(PropTypes.object),
    t: PropTypes.func.isRequired
  };
  state = {
    edit: false
  };
  render() {
    const {t, restaurant, openingHours} = this.props;
    return restaurant && (
      Array.isArray(openingHours) && openingHours.length ? (
        <div />
      ) : (
        <div>
          {t('restaurant.openingHours.notSet')}
        </div>
      )
    );
  }
}
