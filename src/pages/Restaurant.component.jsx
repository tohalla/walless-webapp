import React from 'react';
import {compose} from 'react-apollo';
import Select from 'react-select';
import {Link} from 'react-router';
import {find, get} from 'lodash/fp';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Spinner from 'components/Spinner.component';
import WithSideBar from 'containers/WithSideBar.component';
import Padded from 'containers/Padded.component';
import {
  getActiveAccount,
  getRestaurantsByAccount
} from 'graphql/account/account.queries';
import RestaurantForm from 'restaurant/RestaurantForm.component';
import {isLoading} from 'util/shouldComponentUpdate';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  language: state.util.translation.language
});

const menuItems = [
  {
    path: '',
    translationKey: 'restaurant.restaurant'
  },
  {
    path: 'menus',
    translationKey: 'restaurant.menus.menus'
  },
  {
    path: 'orders',
    translationKey: 'restaurant.orders.orders'
  },
  {
    path: 'menuitems',
    translationKey: 'restaurant.menuItems.menuItems'
  },
  {
    path: 'users',
    translationKey: 'restaurant.userManagement.userManagement'
  },
  {
    path: 'servinglocations',
    translationKey: 'restaurant.servingLocations.servingLocations'
  },
  {
    path: 'dashboard',
    translationKey: 'restaurant.dashboard.dashboard'
  }
];

class Restaurant extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };
  componentWillReceiveProps(newProps) {
    const {
      restaurants,
      getRestaurantsByAccount = {},
      getActiveAccount = {},
      routeParams: {restaurant}
    } = newProps;
    const loading = getRestaurantsByAccount.loading || getActiveAccount.loading;
    if (!loading) {
      if (
        !restaurant &&
        Array.isArray(restaurants) &&
        restaurants.length
      ) {
        newProps.router.push(`/restaurant/${restaurants[0].id}`);
      } else if (
        restaurant &&
        restaurants &&
        !find(r => r.id === Number(restaurant))(restaurants)
      ) {
        newProps.router.push('/restaurant/');
      }
    }
  }
  shouldComponentUpdate = newProps => !isLoading(newProps);
  handleRestaurantChange = value => {
    this.props.router.push(`/restaurant/${value.value}`);
  };
  handleRestaurantSubmit = () => {
    this.props.getRestaurantsByAccount.refetch();
  };
  render() {
    const {
      restaurants,
      routeParams,
      getRestaurantsByAccount = {},
      getActiveAccount = {},
      children,
      t,
      router: {location},
      language
    } = this.props;
    const loading = getRestaurantsByAccount.loading || getActiveAccount.loading;
    const restaurant = routeParams.restaurant ?
      find(restaurant =>
        restaurant.id === Number(routeParams.restaurant)
      )(restaurants) : restaurants[0];
    if (restaurant && restaurants.length) {
      return (
        <WithSideBar
            sideContent={
              <div>
                <Select
                    autoBlur
                    className="Select--dark Select--no-border"
                    clearable={false}
                    name="activeRestaurant"
                    onChange={this.handleRestaurantChange}
                    options={
                      restaurants.map(value => ({
                        value: value.id,
                        label: get(['information', language, 'name'])(value)
                      }))
                    }
                    resetValue={restaurant.id}
                    value={restaurant.id}
                />
                <nav className="side__navigation mdl-navigation">
                  {
                    menuItems.map((item, index) => (
                      <Link
                          className={
                            'side__navigation__link mdl-navigation__link'
                            + (
                                item.path &&
                                location.pathname.indexOf(
                                  `/restaurant/${restaurant.id}/${item.path}`
                              ) === 0 ||
                              (
                                !item.path && (
                                  location.pathname === `/restaurant/${restaurant.id}/` ||
                                  location.pathname === `/restaurant/${restaurant.id}`
                                )
                              ) ?
                                ' side__navigation__link--active' : ''
                            )
                          }
                          key={index}
                          to={`/restaurant/${restaurant.id}/${item.path}`}
                      >
                        {t(item.translationKey)}
                      </Link>
                    ))
                  }
                </nav>
              </div>
            }
        >
          {React.Children.map(children, child =>
            React.cloneElement(child, {restaurant})
          )}
        </WithSideBar>
      );
    }
    return loading ?
      <Spinner /> :
      <Padded>
        <div className="container container--padded container--distinct">
          <RestaurantForm onSubmit={this.handleRestaurantSubmit} />
        </div>
      </Padded>;
  }
}

export default compose(
  getActiveAccount,
  getRestaurantsByAccount
)(connect(mapStateToProps, {})(Restaurant));
