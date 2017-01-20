import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import authenticationHandler from 'util/auth';

const accountFragment = gql`
  fragment accountInformation on Account {
    id
    firstName
    lastName
    emailByEmail {
      email
    }
  }
`;

const roleRightsFragment = gql`
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
`;

const getActiveAccount = graphql(
  gql`
    query {
      getActiveAccount {
        ...accountInformation
      }
    }
    ${accountFragment}
  `,
  {
    skip: () => !authenticationHandler.isAuthenticated,
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

export {accountFragment, roleRightsFragment, getActiveAccount};
