import React from 'react';
import {
  Route,
  IndexRoute
} from 'react-router';

import {requireAuthentication} from 'util/auth';
import RestaurantPage from 'pages/Restaurant.component';
import Menus from 'restaurant/menu/Menus.component';
import Dashboard from 'restaurant/dashboard/Dashboard.component';
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
    <IndexRoute component={Restaurant} />
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
    <Route path="dashboard">
      <IndexRoute component={Dashboard} />
    </Route>
    <Route path="users">
      <IndexRoute component={AccountManagement} />
    </Route>
  </Route>
);
