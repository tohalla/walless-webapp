import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {hasIn} from 'lodash/fp';

import authenticationHandler from 'util/auth';
import {
  formatMenuItem,
  menuItemFragment
} from 'graphql/restaurant/menuItem.queries';

const restaurantFragment = gql`
  fragment restaurantInfo on Restaurant {
    id
    name
    description
    createdBy
  }
`;

const getRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        ...restaurantInfo
      }
    }
    ${restaurantFragment}
  `, {
    skip: ownProps =>
      typeof ownProps.restaurant === 'object' || !ownProps.restaurant,
    options: ownProps => ({
      variables: {
        id: typeof ownProps.restaurant === 'object' ? null : ownProps.restaurant
      }
    }),
    props: ({ownProps, data}) => {
      const {restaurantById, ...rest} = data;
      return {
        restaurant: restaurantById,
        data: rest
      };
    }
  }
);

const getMyRestaurants = graphql(
  gql`
    query {
      getActiveAccount {
        id
        restaurantAccountsByAccount {
          edges {
            node {
              restaurantByRestaurant {
                ...restaurantInfo
              }
            }
          }
        }
      }
    }
    ${restaurantFragment}
  `,
  {
    skip: (ownProps) => !authenticationHandler.isAuthenticated,
    props: ({ownProps, data: {getActiveAccount, ...rest}}) => {
      if (!hasIn(
        [
          'restaurantAccountsByAccount',
          'edges',
          0,
          'node',
          'restaurantByRestaurant'
        ])(getActiveAccount)
      ) {
        return rest;
      }
      return {
        myRestaurants: getActiveAccount.restaurantAccountsByAccount.edges
          .map(edge => edge.node.restaurantByRestaurant),
        ...rest
      };
    }
  }
);

const getMenuItemsByRestaurant = graphql(
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
          .map(edge => formatMenuItem(edge.node)),
        data: rest
      };
    }
  }
);


export {
  getMyRestaurants,
  restaurantFragment,
  getRestaurant,
  getMenuItemsByRestaurant
};
