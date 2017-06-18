import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {orderFragment} from 'walless-graphql/order.queries';

const createOrder = graphql(
  gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      menu {
        ...orderInfo
      }
    }
  }
  ${orderFragment}
  `, {
    props: ({mutate}) => ({
      createOrder: order => mutate({variables: {input: {order}}})
    })
  }
);

const setOrderItems = graphql(
  gql`
  mutation setOrderMenuItems($input: SetOrderMenuItemsInput!) {
    setOrderMenuItems(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      setOrderMenuItems: (order, menuItems) => mutate({
        variables: {
          input: {order, menuItems}
        }
      })
    })
  }
);

export {
  createOrder,
  setOrderItems
};
