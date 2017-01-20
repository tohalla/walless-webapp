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
      createMenuItem: menuItem => mutate({variables: {menuItem: {menuItem}}})
    })
  }
);

const updateMenuItem = graphql(
  gql`
  mutation updateMenuItemById($input: UpdateMenuItemByIdInput!) {
    updateMenuItemById(input: $input) {
      menuItem {
        ...menuItemInfo
      }
    }
  }
  ${menuItemFragment}
  `, {
    props: ({mutate}) => ({
      updateMenuItem: menuItem => mutate({
        variables: {
          input: {
            id: menuItem.id,
            menuItemPatch: menuItem
          }
        }
      })
    })
  }
);

export {createMenuItem, updateMenuItem};
