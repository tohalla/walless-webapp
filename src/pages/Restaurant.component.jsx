import React from 'react';
import Radium from 'radium';
import {compose} from 'react-apollo';
import {find, get, equals} from 'lodash/fp';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import color from 'color';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import {initializeNotificationHandler} from 'util/wsNotificationHandler';
import {minor, normal} from 'styles/spacing';
import Select from 'components/Select.component';
import shadow from 'styles/shadow';
import colors from 'styles/colors';
import loadable from 'decorators/loadable';
import PageContent from 'containers/PageContent.component';
import Navigation from 'navigation/Navigation.component';
import NavigationItem from 'navigation/NavigationItem.component';
import {
  getActiveAccount,
  getRestaurantsByAccount
} from 'graphql/account/account.queries';
import RestaurantForm from 'restaurant/RestaurantForm.component';
import Menus from 'restaurant/menu/Menus.component';
import Dashboard from 'restaurant/dashboard/Dashboard.component';
import Orders from 'restaurant/order/Orders.component';
import MenuItems from 'restaurant/menu-item/MenuItems.component';
import ServingLocations from 'restaurant/serving-location/ServingLocations.component';
import AccountManagement from 'restaurant/account-management/AccountManagement.component';
import RestaurantComponent from 'restaurant/Restaurant.component';


const mapStateToProps = state => ({
  t: state.util.translation.t,
  language: state.util.translation.language
});

@loadable()
@Radium
class Restaurant extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
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
    if (
      newProps.account &&
      !get(['getActiveAccount', 'loading'])(newProps) && (
        !equals(newProps.account)(props.account) ||
        !equals(get(['match', 'params', 'restaurant'])(props))(
          get(['match', 'params', 'restaurant'])(newProps)
        )
      )
    ) {
      initializeNotificationHandler({
        headers: {
          restaurant: get(['match', 'params', 'restaurant'])(newProps)
        }
      });
    }
  };
  checkRestaurant = props => {
    const {restaurants, match: {params: {restaurant}}, history} = props;
    if (!restaurant && Array.isArray(restaurants) && restaurants.length) {
      history.push(`/restaurant/${restaurants[0].id}`);
      return false;
    } else if (!find(r => r.id === Number(restaurant))(restaurants)) {
      history.push('/restaurant/');
      return false;
    }
    return true;
  };
  handleRestaurantChange = ({value}) =>
    this.props.history.push(`/restaurant/${value}`);
  renderRouteComponentWithProps = (Component, props) => routeProps =>
    <Component {...props} {...routeProps} />;
  render() {
    const {
      restaurants,
      match,
      getRestaurantsByAccount = {},
      getActiveAccount = {},
      children,
      t,
      location,
      language
    } = this.props;
    const loading = getRestaurantsByAccount.loading || getActiveAccount.loading;
    if (!loading && restaurants && restaurants.length) {
      const restaurant = match.params.restaurant ?
        find(restaurant =>
          restaurant.id === Number(match.params.restaurant)
      )(restaurants) : restaurants[0];
      return (
        <div style={styles.container}>
          <Navigation style={[styles.navigation, shadow.right]}>
            <Select
                autoBlur
                clearable={false}
                name="activeRestaurant"
                onChange={this.handleRestaurantChange}
                options={
                  restaurants.map(value => ({
                    value: value.id,
                    label: get(['i18n', language, 'name'])(value)
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
                    location.pathname.indexOf(`/restaurant/${restaurant.id}/${item.path}`) === 0 ||
                    (!item.path && (
                      location.pathname === `/restaurant/${restaurant.id}/` ||
                      location.pathname === `/restaurant/${restaurant.id}`
                    ))
                  }
                  activeStyle={styles.navigationItemActive}
                  chevron
                  key={index}
                  path={`/restaurant/${restaurant.id}/${item.path}`}
                  style={styles.navigationItem}
              >
                {t(item.translationKey)}
              </NavigationItem>
            ))}
          </Navigation>
          <PageContent>
            {React.Children.map(children, child =>
              React.cloneElement(child, {restaurant})
            )}

            <Switch>
              <Route
                  component={this.renderRouteComponentWithProps(
                    RestaurantComponent,
                    {restaurant}
                  )}
                  exact path="/restaurant/:restaurant?"
              />
              <Route
                  component={this.renderRouteComponentWithProps(
                    Menus,
                    {restaurant}
                  )}
                  path="/restaurant/:restaurant/menus"
              />
              <Route
                  component={this.renderRouteComponentWithProps(
                    MenuItems,
                    {restaurant}
                  )}
                  path="/restaurant/:restaurant/menuitems"
              />
              <Route
                  component={this.renderRouteComponentWithProps(
                    Orders,
                    {restaurant}
                  )}
                  path="/restaurant/:restaurant/orders"
              />
              <Route
                  component={this.renderRouteComponentWithProps(
                    ServingLocations,
                    {restaurant}
                  )}
                  path="/restaurant/:restaurant/servinglocations"
              />
              <Route
                  component={this.renderRouteComponentWithProps(
                    Dashboard,
                    {restaurant}
                  )}
                  path="/restaurant/:restaurant/dashboard"
              />
              <Route
                  component={this.renderRouteComponentWithProps(
                    AccountManagement,
                    {restaurant}
                  )}
                  path="/restaurant/:restaurant/users"
              />
              <Redirect path="*" to="/restaurant" />
            </Switch>
          </PageContent>
        </div>
      );
    }
    return null && (
      <div style={styles.container}>
        <PageContent>
          <RestaurantForm onSubmit={this.handleRestaurantSubmit} style={styles.contentContainer} />
        </PageContent>
      </div>
    );
  }
}

export default compose(
  connect(mapStateToProps, {}),
  getActiveAccount,
  getRestaurantsByAccount
)(Restaurant);

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
  select: {backgroundColor: colors.gallery},
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
  contentContainer: [{
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
    translationKey: 'restaurant.restaurant'
  },
  {
    path: 'menus',
    translationKey: 'restaurant.menu.menus'
  },
  {
    path: 'orders',
    translationKey: 'restaurant.order.orders'
  },
  {
    path: 'menuitems',
    translationKey: 'restaurant.menuItem.menuItems'
  },
  {
    path: 'users',
    translationKey: 'restaurant.userManagement.userManagement'
  },
  {
    path: 'servinglocations',
    translationKey: 'restaurant.servingLocation.servingLocations'
  },
  {
    path: 'dashboard',
    translationKey: 'restaurant.dashboard.dashboard'
  }
];
