// @flow
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {menuFragment} from 'graphql/restaurant/menu.queries';

const createMenu = graphql(
  gql`
  mutation createMenu($input: CreateMenuInput!) {
    createMenu(input: $input) {
      menu {
        ...menuInfo
      }
    }
  }
  ${menuFragment}
  `, {
    props: ({mutate}) => ({
      createMenu: menu => mutate({variables: {input: {menu}}})
    })
  }
);

const updateMenu = graphql(
  gql`
  mutation updateMenuById($input: UpdateMenuByIdInput!) {
    updateMenuById(input: $input) {
      menu {
        ...menuInfo
      }
    }
  }
  ${menuFragment}
  `, {
    props: ({mutate}) => ({
      updateMenu: menu => mutate({
        variables: {
          input: {
            id: menu.id,
            menuPatch: menu
          }
        }
      })
    })
  }
);

const updateMenuItems = graphql(
  gql`
  mutation updateMenuItems($input: UpdateMenuItemsInput!) {
    updateMenuItems(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuItems: (menu: Number, menuItems: Number[]) => mutate({
        variables: {
          input: {menu, menuItems}
        }
      })
    })
  }
);

export {createMenu, updateMenu, updateMenuItems};
