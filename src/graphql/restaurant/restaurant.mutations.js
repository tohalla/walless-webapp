import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {restaurantFragment} from 'graphql/restaurant/restaurant.queries';

const createRestaurant = graphql(
  gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      restaurant {
        ...restaurantInfo
      }
    }
  }
  ${restaurantFragment}
  `, {
    props: ({mutate}) => ({
      createRestaurant: restaurant => mutate({variables: {input: {restaurant}}})
    })
  }
);

const updateRestaurant = graphql(
  gql`
  mutation updateRestaurantById($input: UpdateRestaurantByIdInput!) {
    updateRestaurantById(input: $input) {
      restaurant {
        ...restaurantInfo
      }
    }
  }
  ${restaurantFragment}
  `, {
    props: ({mutate}) => ({
      updateRestaurant: restaurant => mutate({
        variables: {
          input: {
            id: restaurant.id,
            restaurantPatch: restaurant
          }
        }
      })
    })
  }
);

export {createRestaurant, updateRestaurant};
