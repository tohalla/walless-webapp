// @flow
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
    props: ({mutate, data}) => ({
      createMenuItem: menuItem => mutate({
        variables: {menuItem: {menuItem}}
      })
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
      updateMenuItem: (menuItem: {id: Number}) => mutate({
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

const updateMenuItemFiles = graphql(
  gql`
  mutation updateMenuItemFiles($input: UpdateMenuItemFilesInput!) {
    updateMenuItemFiles(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuItemFiles: (menuItem: Number, files: Number[]) => mutate({
        variables: {
          input: {menuItem, files}
        }
      })
    })
  }
);

export {createMenuItem, updateMenuItem, updateMenuItemFiles};
