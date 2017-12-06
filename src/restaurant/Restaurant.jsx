import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {pick, get} from 'lodash/fp';
import {restaurant, account} from 'walless-graphql';

import PopOverMenu from 'components/PopOverMenu';
import RestaurantForm from 'restaurant/RestaurantForm';
import WithActions from 'components/WithActions';
import ItemsWithLabels from 'components/ItemsWithLabels';
import ManageOpeningHours from 'restaurant/ManageOpeningHours';
import loadable from 'decorators/loadable';

@loadable()
@translate()
@Radium
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
        hide: true,
        hideReturn: true,
        hideContent: true,
        item: (
          <RestaurantForm
            onCancel={this.handleActionChange}
            onSubmit={this.handleRestaurantSubmit}
            restaurant={action ? action.restaurant : restaurant}
          />
        )
      },
      manageOpeningHours: {
        hide: true,
        hideReturn: true,
        hideContent: true,
        item: (
          <ManageOpeningHours
            onCancel={this.handleActionChange}
            onSubmit={this.handleRestaurantSubmit}
            restaurant={action ? action.restaurant : restaurant}
          />
        )
      }
    };
    return typeof restaurant === 'object' && (
      <WithActions
        action={action ? action.key : null}
        actions={actions}
        hideActions
        onActionChange={this.handleActionChange}
      >
        <div style={styles.titleContainer}>
          <h2>{name}</h2>
          <PopOverMenu
            items={Object.keys(actions).map(key => ({
              label: t(`restaurant.action.${key}`),
              onClick: this.handleActionSelect({key, restaurant})
            }))}
            label={<i className='material-icons'>{'more_vert'}</i>}
          />
        </div>
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

const styles = {
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};
