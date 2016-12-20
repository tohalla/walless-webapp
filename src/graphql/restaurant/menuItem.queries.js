import {graphql} from 'react-apollo';
import {hasIn} from 'lodash/fp';
import gql from 'graphql-tag';

import authenticationHandler from 'util/auth';

const menuItemFragment = gql`
  fragment menuItemInfo on MenuItem {
    id
    name
    description
    restaurant
    createdAt
    createdBy
    category
    type
  }
`;

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
    ${menuItemFragment}
  `, {
    skip: ownProps => !authenticationHandler.isAuthenticated,
    options: ownProps => ({
      variables: {
        id: ownProps.restaurant.id
      }
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
        menuItems: restaurantById.menuItemsByRestaurant.edges
          .map(edge => edge.node),
        data: rest
      };
    }
  }
);

export {menuItemFragment, getMenuItems};
