import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {hasIn} from 'lodash/fp';

import authenticationHandler from 'util/auth';

const restaurantFragment = gql`
  fragment restaurantInfo on Restaurant {
    id
    name
  }
`;

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
    ${restaurantFragment}
  `,
  {
    skip: (ownProps) => !authenticationHandler.isAuthenticated,
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
