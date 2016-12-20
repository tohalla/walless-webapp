import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {menuItemFragment} from 'graphql/restaurant/menuItem.queries';

const createMenuItem = graphql(
  gql`
  mutation createMenuItem($menuItem: CreateMenuItemInput!) {
    createMenuItem(input: $menuItem) {
      menuItem {
        ...menuItemInfo
      }
    }
  }
  ${menuItemFragment}
  `, {
    props: ({mutate}) => ({
      createMenu: menuItem => mutate({variables: {menuItem: {menuItem}}})
    })
  }
);

export {createMenuItem};
