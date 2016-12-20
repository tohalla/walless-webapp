import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {menuFragment} from 'graphql/restaurant/menu.queries';

const createMenu = graphql(
  gql`
  mutation createMenu($menu: CreateMenuInput!) {
    createMenu(input: $menu) {
      menu {
        ...menuInfo
      }
    }
  }
  ${menuFragment}
  `, {
    props: ({mutate}) => ({
      createMenu: menu => mutate({variables: {menu: {menu}}})
    })
  }
);

export {createMenu};
