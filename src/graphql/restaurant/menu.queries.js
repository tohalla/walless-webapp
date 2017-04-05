import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {menuItemFragment} from 'graphql/restaurant/menuItem.queries';

const menuFragment = gql`
  fragment menuInfo on Menu {
    id
    name
    description
    menuMenuItemsByMenu {
      edges {
        node {
          menuItemByMenuItem {
            ...menuItemInfo
          }
        }
      }
    }
  }
  ${menuItemFragment}
`;

const getMenu = graphql(
  gql`
    query menuById($id: Int!) {
      menuById(id: $id) {
        ...menuInfo
      }
    }
    ${menuFragment}
  `, {
    skip: ownProps => typeof ownProps.menu !== 'number',
    options: ownProps => ({
      variables: {
        id: typeof ownProps.menu === 'number' ? ownProps.menu : null
      }
    }),
    props: ({ownProps, data}) => {
      const {menuById: menu, ...rest} = data;
      return {getMenu: {
        menu,
        data: rest
      }};
    }
  }
);

export {menuFragment, getMenu};
