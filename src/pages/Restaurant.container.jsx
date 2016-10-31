import React from 'react';
import {compose} from 'react-apollo';
import Select from 'react-select';
import {Link} from 'react-router';

import WithSideBar from 'containers/WithSideBar.component';
import {getMyRestaurants} from 'graphql/restaurant/restaurant.queries';


class Restaurant extends React.Component {
  static contextTypes = {
    t: React.PropTypes.func
  };
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
      router: {location}
    } = this.props;
    const restaurant = Number(routeParams.restaurant);
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
    const {t} = this.context;
    if (myRestaurants && myRestaurants.length) {
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
                    resetValue={restaurant}
                    value={restaurant}
                />
                <nav className="side__navigation mdl-navigation">
                  {
                    menuItems.map((item, index) => (
                      <Link
                          className={
                            'side__navigation__link mdl-navigation__link'
                            + (
                              location.pathname.indexOf(
                                `/restaurant/${restaurant}/${item.path}`
                              ) === 0 ? ' side__navigation__link--active' : ''
                            )
                          }
                          key={index}
                          to={`/restaurant/${restaurant}/${item.path}`}
                      >
                        {t(item.translationKey)}
                      </Link>
                    ))
                  }
                </nav>
              </div>
            }
        >
          {children}
        </WithSideBar>
      );
    }
    return null;
  }
}

export default compose(
  getMyRestaurants
)(Restaurant);
