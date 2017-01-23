import React from 'react';
import {compose} from 'react-apollo';
import Select from 'react-select';
import {Link} from 'react-router';
import {find} from 'lodash/fp';
import {connect} from 'react-redux';

import Spinner from 'mdl/Spinner.component';
import WithSideBar from 'containers/WithSideBar.component';
import Padded from 'containers/Padded.component';
import {getMyRestaurants} from 'graphql/restaurant/restaurant.queries';
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
  };
  handleRestaurantCreation = () => {
    this.props.refetch();
  };
  render() {
    const {
      myRestaurants,
      routeParams,
      children,
      t,
      router: {location},
      loading
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
  getMyRestaurants
)(connect(mapStateToProps, {})(Restaurant));
