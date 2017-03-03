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
import Restaurant from 'restaurant/Restaurant.component';

export default (
  <Route
      component={RestaurantPage}
      onEnter={requireAuthentication}
      path="restaurant(/:restaurant)"
  >
    <IndexRoute
        component={routeParamWrapper(Restaurant, ['restaurant'])}
    />
    <Route path="menus">
      <IndexRoute component={Menus} />
      <Route
          component={routeParamWrapper(Menu, ['menu'], {expand: true})}
          path=":menu"
      />
    </Route>
    <Route path="menuitems">
      <IndexRoute component={MenuItems} />
      <Route
          component={
            routeParamWrapper(MenuItem, ['menuItem'], {expand: true})
          }
          path=":menuItem"
      />
    </Route>
  </Route>
);
