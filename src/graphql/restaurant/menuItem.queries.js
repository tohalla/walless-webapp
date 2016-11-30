import {createFragment} from 'apollo-client';
import {graphql} from 'react-apollo';
import {hasIn} from 'lodash/fp';
import gql from 'graphql-tag';

import authenticationHandler from 'util/auth';

const menuItemFragment = createFragment(gql`
  fragment menuItemInfo on MenuItem {
    id
    name
    description
  }
`);

const getMenuItems = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        menuItemsByRestaurant {
          edges {
            node {
              ...menuItemInfo
            }
          }
        }
      }
    }
  `, {
    skip: ownProps => !authenticationHandler.isAuthenticated,
    options: ownProps => ({
      variables: {
        id: ownProps.restaurant.id
      },
      fragments: [menuItemFragment]
    }),
    props: ({ownProps, data}) => {
      const {restaurantById, ...rest} = data;
      if (!hasIn(
        [
          'menuItemsByRestaurant',
          'edges'
        ])(restaurantById)
      ) {
        return {data: rest};
      }
      return {
        menus: restaurantById.menuItemsByRestaurant.edges
          .map(edge => edge.node),
        data: rest
      };
    }
  }
);

export {menuItemFragment, getMenuItems};
