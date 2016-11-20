import {graphql} from 'react-apollo';
import {createFragment} from 'apollo-client';
import gql from 'graphql-tag';
import {hasIn} from 'lodash/fp';

import authenticationHandler from 'util/auth';

const restaurantFragment = createFragment(gql`
  fragment restaurantInfo on Restaurant {
    id
    name
  }
`);

const getMyRestaurants = graphql(
  gql`
    query {
      getActiveAccount {
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
  `,
  {
    skip: (ownProps) => !authenticationHandler.isAuthenticated,
    options: {
      fragments: [restaurantFragment]
    },
    props: ({ownProps, data: {getActiveAccount}}) => {
      if (!hasIn(
        [
          'restaurantAccountsByAccount',
          'edges',
          0,
          'node',
          'restaurantByRestaurant'
        ])(getActiveAccount)
      ) {
        return null;
      }
      return {
        myRestaurants: getActiveAccount.restaurantAccountsByAccount.edges
          .map(edge => edge.node.restaurantByRestaurant)
      };
    }
  }
);

export {getMyRestaurants, restaurantFragment};
