import {createFragment} from 'apollo-client';
import gql from 'graphql-tag';

const menuFragment = createFragment(gql`
  fragment menuInfo on Restaurant {
    id
    name
    description
  }
`);

export {menuFragment};
