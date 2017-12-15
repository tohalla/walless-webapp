import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';

import AvailabilityForm from 'availability/AvailabilityForm';

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
        <Fragment />
      ) : (
        <Fragment>
          <h2>{t('restaurant.openingHours.setOpeningHours')}</h2>
          <AvailabilityForm />
        </Fragment>
      )
    );
  }
}
