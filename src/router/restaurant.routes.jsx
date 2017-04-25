import React from 'react';
import {
  Route,
  IndexRoute
} from 'react-router';

import routeParamWrapper from 'util/routeParamWrapper';
import {requireAuthentication} from 'util/auth';
import RestaurantPage from 'pages/Restaurant.component';
import Menu from 'restaurant/menu/Menu.component';
import MenuItem from 'restaurant/menu-item/MenuItem.component';
import Menus from 'restaurant/menu/Menus.component';
import MenuItems from 'restaurant/menu-item/MenuItems.component';
import ServingLocations from 'restaurant/serving-location/ServingLocations.component';
import AccountManagement from 'restaurant/account-management/AccountManagement.component';
import Restaurant from 'restaurant/Restaurant.component';

export default (
  <Route
      component={RestaurantPage}
      onEnter={requireAuthentication}
      path="restaurant(/:restaurant)"
  >
    <IndexRoute
        component={routeParamWrapper(Restaurant, [{
          key: 'restaurant',
          transform: value => Number(value)
        }])}
    />
    <Route path="menus">
      <IndexRoute component={Menus} />
      <Route
          component={routeParamWrapper(Menu, [{
            key: 'menu',
            transform: value => Number(value)
          }], {expand: true})}
          path=":menu"
      />
    </Route>
    <Route path="menuitems">
      <IndexRoute component={MenuItems} />
      <Route
          component={routeParamWrapper(MenuItem, [{
            key: 'menuItem',
            transform: value => Number(value)
          }], {expand: true})}
          path=":menuItem"
      />
    </Route>
    <Route path="servinglocations">
      <IndexRoute component={ServingLocations} />
    </Route>
    <Route component={AccountManagement} path="users" />
  </Route>
);
