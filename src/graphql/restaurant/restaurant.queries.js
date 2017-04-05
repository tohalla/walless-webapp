import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {hasIn} from 'lodash/fp';

import authenticationHandler from 'util/auth';
import {
  formatMenuItem,
  menuItemFragment
} from 'graphql/restaurant/menuItem.queries';
import {
  menuFragment
} from 'graphql/restaurant/menu.queries';

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
      typeof ownProps.restaurant !== 'number',
    options: ownProps => ({
      variables: {
        id: typeof ownProps.restaurant === 'number' ? ownProps.restaurant : null
      }
    }),
    props: ({ownProps, data}) => {
      const {restaurantById, ...rest} = data;
      return {
        getRestaurant: {restaurant: restaurantById, data: rest}
      };
    }
  }
);

const getMenuItemsByRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        id
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
        getMenuItemsByRestaurant: {
          menuItems: restaurantById.menuItemsByRestaurant.edges
            .map(edge => formatMenuItem(edge.node)),
          data: rest
        }
      };
    }
  }
);

const getAccountsByRestaurant = graphql(
  gql`
    query accountsByRestaurant($id: Int!) {
      restaurantById(id: $id) {
        id
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
      return {
        getAccountsByRestaurant: {
          accounts: hasIn(['restaurantAccountsByRestaurant', 'edges'])(restaurantById) ?
            restaurantById.restaurantAccountsByRestaurant.edges
              .map(edge => formatMenuItem(edge.node)) : [],
          data: rest
        }
      };
    }
  }
);

const getRolesByRestaurant = graphql(
  gql`
    query rolesByRestaurant($restaurant: Int!) {
      rolesByRestaurant(restaurant: $restaurant) {
        edges {
          node {
            id
            name
            description
          }
        }
      }
    }
  `, {
    options: ownProps => ({
      variables: {
        restaurant: ownProps.restaurant.id
      }
    }),
    props: ({ownProps, data}) => {
      const {rolesByRestaurant, ...rest} = data;
      return {
        getRolesByRestaurant: {
          roles: hasIn(['edges'])(rolesByRestaurant) ?
            rolesByRestaurant.edges.map(edge => edge.node) : [],
          data: rest
        }
      };
    }
  }
);

const getMenusByRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        id
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
      return {getMenusByRestaurant: {
        menus: restaurantById.menusByRestaurant.edges
          .map(edge => edge.node),
        data: rest
      }};
    }
  }
);

export {
  restaurantFragment,
  getRestaurant,
  getMenuItemsByRestaurant,
  getAccountsByRestaurant,
  getMenusByRestaurant,
  getRolesByRestaurant
};
