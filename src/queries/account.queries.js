import {graphql} from 'react-apollo';
import {createFragment} from 'apollo-client';
import gql from 'graphql-tag';

import authenticationHandler from 'util/auth';

export const accountFragment = createFragment(gql`
  fragment accountInformation on Account {
    id
    firstName
    lastName
    emailByEmail {
      email
    }
  }
`);

export const roleRightsFragment = createFragment(gql`
  fragment roleRights on RestaurantRoleRight {
    id
    allowAddPromotion
    allowAlterPromotion
    allowDeletePromotion
    allowAddMenu
    allowAlterMenu
    allowDeleteMenu
    allowAddMenuItem
    allowAlterMenuItem
    allowDeleteMenuItem
    allowChangeRestaurantDescription
    allowChangeRestaurantDescription
    allowAlterRestaurantRoles
    allowMapRoles
  }
`);

export const getActiveAccount = graphql(
  gql`
    query {
      getActiveAccount {
        ...accountInformation
      }
    }
  `,
  {
    skip: (ownProps) => !authenticationHandler.isAuthenticated,
    options: {
      fragments: [accountFragment]
    },
    props: ({ownProps, data: {getActiveAccount}}) => {
      if (!getActiveAccount)
        return null;
      const {emailByEmail: {email}, ...rest} = getActiveAccount;
      return {
        me: Object.assign({}, rest, {email})
      };
    }
  }
);
