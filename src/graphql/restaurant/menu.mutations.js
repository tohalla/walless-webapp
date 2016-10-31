import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

export {createMenu};

const createMenu = graphql(
  gql`
    mutation createMenu {

    }
  `, {
    props: ({mutate}) => ({
      submit: (name, description) => mutate({variables: {name, description}})
    })
  }
);

