import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {pick, get} from 'lodash/fp';
import {restaurant, account} from 'walless-graphql';

import RestaurantForm from 'restaurant/RestaurantForm';
import WithActions from 'components/WithActions';
import ItemsWithLabels from 'components/ItemsWithLabels';
import ManageOpeningHours from 'restaurant/ManageOpeningHours';
import loadable from 'decorators/loadable';

@loadable()
@translate()
class Restaurant extends React.Component {
  static propTypes = {
    restaurant: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object
    ]),
    i18n: PropTypes.shape({languages: PropTypes.arrayOf(PropTypes.string)}),
    t: PropTypes.func.isRequired
  };
  state = {
    action: null
  };
  componentWillMount = () => {
    this._mounted = true;
  };
  componentWillUnmount = () => {
    this._mounted = false;
  };
  handleRestaurantSubmit = () =>
    this._mounted && this.setState({action: null});
  handleActionChange = action => this.setState({action});
  handleActionSelect = action => () => this.handleActionChange(action);
  render() {
    const {
      restaurant,
      t,
      i18n: {languages: [language]}
    } = this.props;
    const {action} = this.state;
    const {name, description} = pick([
      'name',
      'description'
    ])(get(['i18n', language])(restaurant));
    const actions = {
      edit: {
        label: t('restaurant.action.edit'),
        hideReturn: true,
        hideContent: true,
        item: (
          <RestaurantForm
            onCancel={this.handleActionChange}
            onSubmit={this.handleRestaurantSubmit}
            restaurant={restaurant}
          />
        )
      },
      manageOpeningHours: {
        label: t('restaurant.action.manageOpeningHours'),
        hideReturn: true,
        hideContent: true,
        item: (
          <ManageOpeningHours
            onCancel={this.handleActionChange}
            onSubmit={this.handleRestaurantSubmit}
            restaurant={restaurant}
          />
        )
      }
    };
    return typeof restaurant === 'object' && (
      <WithActions
        action={action ? action.key : undefined}
        actions={actions}
        simpleActions
        title={name}
        onActionChange={this.handleActionChange}
      >
        <ItemsWithLabels
          items={[
            {label: t('restaurant.description'), item: description}
          ]}
        />
      </WithActions>
    );
  }
}

export default compose(
  account.getActiveAccount,
  restaurant.getRestaurant,
  account.getRestaurantsByAccount
)(Restaurant);
