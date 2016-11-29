import {createFragment} from 'apollo-client';
import {graphql} from 'react-apollo';
import {hasIn} from 'lodash/fp';
import gql from 'graphql-tag';

import authenticationHandler from 'util/auth';

const menuFragment = createFragment(gql`
  fragment menuInfo on Restaurant {
    id
    name
    description
  }
`);

const getMenus = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        menusByCreatedBy {
          edges {
            node {
              name
              description
            }
          }
        }
      }
    }
  `, {
    skip: (ownProps) => !authenticationHandler.isAuthenticated,
    options: {
      variables: {
        id: 1
      }
    },
    props: ({ownProps, data}) => {
      const {restaurantById, ...rest} = data;
      if (!hasIn(
        [
          'menusByCreatedBy',
          'edges'
        ])(restaurantById)
      ) {
        return {data: rest};
      }
      return {
        menus: restaurantById.menusByCreatedBy.edges
          .map(edge => edge.node),
        data: rest
      };
    }
  }
);

export {menuFragment, getMenus};
