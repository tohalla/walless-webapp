import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {find, get, equals} from 'lodash/fp';
import color from 'color';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import {account} from 'walless-graphql';
import i18next from 'i18next';

import {initializeNotificationHandler} from 'util/wsNotificationHandler';
import {minor, normal} from 'styles/spacing';
import Select from 'components/Select';
import shadow from 'styles/shadow';
import colors from 'styles/colors';
import loadable from 'decorators/loadable';
import PageContent from 'containers/PageContent';
import Navigation from 'navigation/Navigation';
import NavigationItem from 'navigation/NavigationItem';
import RestaurantForm from 'restaurant/RestaurantForm';
import Menus from 'restaurant/menu/Menus';
import Dashboard from 'restaurant/dashboard/Dashboard';
import Orders from 'restaurant/order/Orders';
import MenuItems from 'restaurant/menu-item/MenuItems';
import ServingLocations from 'restaurant/serving-location/ServingLocations';
import AccountManagement from 'restaurant/account-management/AccountManagement';
import Restaurant from 'restaurant/Restaurant';

@loadable()
@translate()
@Radium
class RestaurantPage extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    getActiveAccount: PropTypes.shape({loading: PropTypes.bool}),
    getRestaurantsByAccount: PropTypes.shape({refetch: PropTypes.func}),
    restaurants: PropTypes.arrayOf(
      PropTypes.shape({id: PropTypes.number.isRequired})
    ),
    history: PropTypes.shape({push: PropTypes.func.isRequired}),
    location: PropTypes.shape({pathname: PropTypes.string}),
    match: PropTypes.shape({
      params: PropTypes.shape({restaurant: PropTypes.string})
    }),
    t: PropTypes.func.isRequired
  };
  componentWillMount() {
    if (this.checkRestaurant(this.props)) {
      this.initializeNotificationHandler({}, this.props);
    }
  }
  componentWillReceiveProps(newProps) {
    if (this.checkRestaurant(newProps)) {
      this.initializeNotificationHandler(this.props, newProps);
    }
  };
  initializeNotificationHandler = (props, newProps) => {
    const restaurant = get(['match', 'params', 'restaurant'])(newProps);
    if (
      newProps.account && restaurant &&
      !get(['getActiveAccount', 'loading'])(newProps) && (
        !equals(newProps.account)(props.account) ||
        !equals(get(['match', 'params', 'restaurant'])(props))(
          restaurant
        )
      )
    ) {
      initializeNotificationHandler({
        headers: {
          restaurant
        }
      });
    }
  };
  checkRestaurant = props => {
    const {restaurants, match: {params: {restaurant}}, history} = props;
    if (!restaurant && Array.isArray(restaurants) && restaurants.length) {
      history.push(`/${restaurants[0].id}`);
      return false;
    } else if (!find(r => r.id === Number(restaurant))(restaurants)) {
      if (location.pathname !== '/') history.push('/');
      return false;
    }
    return true;
  };
  handleRestaurantSubmit = () => this.props.getRestaurantsByAccount.refetch();
  handleRestaurantChange = ({value}) =>
    this.props.history.push(`/${value}`);
  renderRouteComponentWithProps = (Component, props) => routeProps =>
    <Component {...props} {...routeProps} />;
  render() {
    const {
      restaurants,
      match,
      getRestaurantsByAccount = {},
      getActiveAccount = {},
      location,
      t
    } = this.props;
    const loading = getRestaurantsByAccount.loading || getActiveAccount.loading;
    if (!loading && restaurants && restaurants.length) {
      const restaurant = match.params.restaurant ?
        find(restaurant =>
          restaurant.id === Number(match.params.restaurant)
        )(restaurants) : restaurants[0];
      return restaurant ? (
        <div style={styles.container}>
          <Navigation style={[styles.navigation, shadow.right]}>
            <Select
              autoBlur
              clearable={false}
              name='activeRestaurant'
              onChange={this.handleRestaurantChange}
              options={
                restaurants.map(value => ({
                  value: value.id,
                  label: get(['i18n', i18next.languages[0], 'name'])(value)
                }))
              }
              resetValue={restaurant.id}
              style={styles.select}
              value={restaurant.id}
            />
            {menuItems.map((item, index) => (
              <NavigationItem
                active={
                  item.path &&
                    location.pathname.indexOf(`/${restaurant.id}/${item.path}`) === 0 ||
                    (!item.path && (
                      location.pathname === `/${restaurant.id}/` ||
                      location.pathname === `/${restaurant.id}`
                    ))
                }
                activeStyle={styles.navigationItemActive}
                chevron
                key={index}
                path={`/${restaurant.id}/${item.path}`}
                style={styles.navigationItem}
              >
                {t(item.translationKey)}
              </NavigationItem>
            ))}
          </Navigation>
          <PageContent>
            <Switch>
              {menuItems.map(({path, Component}) => (
                <Route
                  component={this.renderRouteComponentWithProps(
                    Component,
                    {restaurant}
                  )}
                  exact
                  key={path}
                  path={`/:restaurant/${path}`}
                />
              ))}
              <Redirect path='/:restaurant/*' to='/' />
            </Switch>
          </PageContent>
        </div>
      ) : null;
    }
    return (
      <PageContent>
        <RestaurantForm
          onSubmit={this.handleRestaurantSubmit}
          style={styles.content}
        />
      </PageContent>
    );
  }
}

export default compose(
  account.getActiveAccount,
  account.getRestaurantsByAccount
)(RestaurantPage);

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    width: 0
  },
  navigation: {
    display: 'flex',
    flex: '0 0 12rem',
    backgroundColor: colors.backgroundLight,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  select: {
    backgroundColor: colors.gallery,
    border: 'none'
  },
  navigationItem: {
    color: color(colors.foregroundDark).lighten(0.2).hex(),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    backgroundColor: colors.backgroundLight,
    padding: `${minor}`,
    textDecoration: 'none',
    [':hover']: {
      color: colors.foregroundDark,
      backgroundColor: colors.carrara
    }
  },
  navigationItemActive: {
    color: colors.black,
    backgroundColor: colors.backgroundLight,
    textDecoration: 'underline',
    fontWeight: 900,
    [':hover']: {
      color: colors.black,
      backgroundColor: colors.backgroundLight
    }
  },
  content: [{
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    background: colors.backgroundLight,
    padding: normal
  }, shadow.small]
};

const menuItems = [
  {
    path: '',
    translationKey: 'restaurant.restaurant',
    Component: Restaurant
  },
  {
    path: 'menus',
    translationKey: 'restaurant.menu.menus',
    Component: Menus
  },
  {
    path: 'orders',
    translationKey: 'restaurant.order.orders',
    Component: Orders
  },
  {
    path: 'items',
    translationKey: 'restaurant.item.items',
    Component: MenuItems
  },
  {
    path: 'users',
    translationKey: 'restaurant.userManagement.userManagement',
    Component: AccountManagement
  },
  {
    path: 'servinglocations',
    translationKey: 'restaurant.servingLocation.servingLocations',
    Component: ServingLocations
  },
  {
    path: 'dashboard',
    translationKey: 'restaurant.dashboard.dashboard',
    Component: Dashboard
  }
];
