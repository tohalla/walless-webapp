import React from 'react';
import {compose} from 'react-apollo';
import Select from 'react-select';
import {Link} from 'react-router';
import {find} from 'lodash/fp';
import {connect} from 'react-redux';

import WithSideBar from 'containers/WithSideBar.component';
import {getMyRestaurants} from 'graphql/restaurant/restaurant.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

const menuItems = [
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
    translationKey: 'restaurant.users'
  },
  {
    path: 'settings',
    translationKey: 'restaurant.settings'
  },
  {
    path: 'dashboard',
    translationKey: 'restaurant.dashboard'
  }
];

class Restaurant extends React.Component {
  static propTypes = {
    me: React.PropTypes.object,
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  };
  componentWillReceiveProps(newProps) {
    const {myRestaurants} = newProps;
    if (
      myRestaurants &&
      myRestaurants.length &&
      !newProps.routeParams.restaurant
    ) {
      this.props.router.push(`/restaurant/${myRestaurants[0].id}`);
    }
  }
  handleRestaurantChange = value => {
    this.props.router.push(`/restaurant/${value.value}`);
  }
  render() {
    const {
      myRestaurants,
      routeParams,
      children,
      t,
      router: {location}
    } = this.props;
    const restaurant = find(restaurant =>
      restaurant.id === Number(routeParams.restaurant)
    )(myRestaurants);
    if (restaurant && myRestaurants.length) {
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
                      myRestaurants.map(value => ({
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
                              location.pathname.indexOf(
                                `/restaurant/${restaurant.id}/${item.path}`
                              ) === 0 ? ' side__navigation__link--active' : ''
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
    return <div>{'placeholder message. No restaurants linked to this account'}</div>;
  }
}

export default compose(
  getMyRestaurants
)(connect(mapStateToProps, {})(Restaurant));
