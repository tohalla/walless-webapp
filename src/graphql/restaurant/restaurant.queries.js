import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {hasIn} from 'lodash/fp';

import authenticationHandler from 'util/auth';

export {getMyRestaurants};

const getMyRestaurants = graphql(
  gql`
    query {
      getActiveAccount {
        restaurantAccountsByAccount {
          edges {
            node {
              restaurantByRestaurant {
                id
                name
              }
            }
          }
        }
      }
    }
  `,
  {
    skip: (ownProps) => !authenticationHandler.isAuthenticated,
    // options: {
    //   fragments: [roleRightsFragment]
    // },
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
