import {graphql} from 'react-apollo';
import {hasIn} from 'lodash/fp';
import gql from 'graphql-tag';

import authenticationHandler from 'util/auth';

const menuFragment = gql`
  fragment menuInfo on Menu {
    id
    name
    description
  }
`;

const getMenus = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        menusByRestaurant {
          edges {
            node {
              ...menuInfo
            }
          }
        }
      }
    }
    ${menuFragment}
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
          'menusByRestaurant',
          'edges'
        ])(restaurantById)
      ) {
        return {data: rest};
      }
      return {
        menus: restaurantById.menusByRestaurant.edges
          .map(edge => edge.node),
        data: rest
      };
    }
  }
);

export {menuFragment, getMenus};
