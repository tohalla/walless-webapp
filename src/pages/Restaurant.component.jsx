import React from 'react';
import {compose} from 'react-apollo';
import Select from 'react-select';
import {Link} from 'react-router';
import {find} from 'lodash/fp';
import {connect} from 'react-redux';
import {hasIn} from 'lodash/fp';

import Spinner from 'mdl/Spinner.component';
import WithSideBar from 'containers/WithSideBar.component';
import Padded from 'containers/Padded.component';
import {getActiveAccount} from 'graphql/account/account.queries';
import RestaurantForm from 'restaurant/RestaurantForm.component';

const mapStateToProps = state => ({t: state.util.translation.t});

const menuItems = [
  {
    path: '',
    translationKey: 'restaurant'
  },
  {
    path: 'menus',
    translationKey: 'restaurant.menus'
  },
  {
    path: 'menuitems',
    translationKey: 'restaurant.menuItems'
  },
  {
    path: 'users',
    translationKey: 'restaurant.userManagement'
  },
  {
    path: 'servinglocations',
    translationKey: 'restaurant.servingLocations'
  },
  {
    path: 'dashboard',
    translationKey: 'restaurant.dashboard'
  }
];

class Restaurant extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  };
  componentWillReceiveProps(newProps) {
    const {getActiveAccount: {account}} = newProps;
    if (
      !newProps.routeParams.restaurant &&
      hasIn([
        'restaurantAccountsByAccount',
        'edges',
        0,
        'node',
        'restaurantByRestaurant'
      ])(account) &&
      account.restaurantAccountsByAccount.edges.length
    ) {
      this.props.router.push(
        '/restaurant/' +
        account.restaurantAccountsByAccount.edges[0]
          .node.restaurantByRestaurant.id
      );
    }
  }
  handleRestaurantChange = value => {
    this.props.router.push(`/restaurant/${value.value}`);
  };
  handleRestaurantCreation = () => {
    this.props.refetch();
  };
  render() {
    const {
      getActiveAccount: {account, data: {loading}},
      routeParams,
      children,
      t,
      router: {location}
    } = this.props;
    const restaurants = hasIn([
      'restaurantAccountsByAccount',
      'edges',
      0,
      'node',
      'restaurantByRestaurant'
    ])(account) ?
      account.restaurantAccountsByAccount.edges
        .map(edge => edge.node.restaurantByRestaurant) :
      [];
    const restaurant = routeParams.restaurant ?
      find(restaurant =>
        restaurant.id === Number(routeParams.restaurant)
      )(restaurants) :
      restaurants[0];
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
                        label: value.name
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
                                !item.path &&
                                location.pathname === `/restaurant/${restaurant.id}/`
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
        <div className="container container--distinct">
          <RestaurantForm onSubmit={this.handleRestaurantCreation} />
        </div>
      </Padded>;
  }
}

export default compose(
  getActiveAccount
)(connect(mapStateToProps, {})(Restaurant));
