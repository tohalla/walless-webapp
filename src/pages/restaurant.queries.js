import Relay from 'react-relay';

export default {
  account: () => Relay.QL`
    query {
      getActiveAccount
    }
  `
};
