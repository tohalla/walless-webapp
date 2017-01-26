import gql from 'graphql-tag';

const fileFragment = gql`
  fragment fileInfo on File {
    id
    uri
    key
  }
`;

export {fileFragment};
