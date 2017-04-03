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
      typeof ownProps.restaurant !== 'string',
    options: ownProps => ({
      variables: {
        id: typeof ownProps.restaurant === 'string' ? ownProps.restaurant : null
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

const getAccountsByRestaurant = graphql(
  gql`
    query accountsByRestaurant($id: Int!) {
      restaurantById(id: $id) {
        restaurantAccountsByRestaurant {
          edges {
            node {
              accountRoleByRole {
                name
              }
              accountByAccount {
                id
                firstName
                lastName
              }
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
      }
    }),
    props: ({ownProps, data}) => {
      const {restaurantById, ...rest} = data;
      const accountsByRestaurant = rest;
      if (!hasIn(
        [
          'restaurantAccountsByRestaurant',
          'edges'
        ])(restaurantById)
      ) {
        return {accountsByRestaurant};
      }
      return {
        accountsByRestaurant: Object.assign({
          accounts: restaurantById.restaurantAccountsByRestaurant.edges
            .map(edge => formatMenuItem(edge.node))
        }, accountsByRestaurant)
      };
    }
  }
);

const getRolesByRestaurant = graphql(
  gql`
    query rolesByRestaurant($restaurant: Int!) {
      rolesByRestaurant(restaurant: $restaurant) {
        id
        name
        description
      }
    }
  `, {
    options: ownProps => ({
      variables: {
        restaurant: ownProps.restaurant.id
      }
    })
  }
);

export {
  restaurantFragment,
  getRestaurant,
  getMenuItemsByRestaurant,
  getAccountsByRestaurant,
  getRolesByRestaurant
};
