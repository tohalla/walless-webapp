import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const createMenu = graphql(
  gql`
  mutation createMenu($menu: CreateMenuInput!) {
    createMenu(input: $menu) {
      menu {
        name
        description
        id
      }
    }
  }
  `, {
    props: ({mutate}) => ({
      createMenu: menu => mutate({variables: {menu: {menu}}})
    })
  }
);

export {createMenu};
