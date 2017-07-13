import React from 'react';
import {
  Route,
  IndexRoute
} from 'react-router';

import routeParamWrapper from 'util/routeParamWrapper';
import {requireAuthentication} from 'util/auth';
import RestaurantPage from 'pages/Restaurant.component';
import Menus from 'restaurant/menu/Menus.component';
import Orders from 'restaurant/order/Orders.component';
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
    </Route>
    <Route path="menuitems">
      <IndexRoute component={MenuItems} />
    </Route>
    <Route path="orders">
      <IndexRoute component={Orders} />
    </Route>
    <Route path="servinglocations">
      <IndexRoute component={ServingLocations} />
    </Route>
    <Route component={AccountManagement} path="users" />
  </Route>
);
