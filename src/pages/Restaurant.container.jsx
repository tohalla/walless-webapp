import React from 'react';
import Relay from 'react-relay';

import WithSideBar from '../containers/WithSideBar.component';

class Restaurant extends React.Component {
  static propTypes = {
    account: React.PropTypes.object,
    relay: React.PropTypes.object.isRequired
  };
  render() {
    console.log(this.props.account);
    return (
      <WithSideBar>
        {'content'}
      </WithSideBar>
    );
  }
}

export default Relay.createContainer(Restaurant, {
  fragments: {
    account: () => Relay.QL`
      fragment on Account {
        restaurantAccountNodesByAccount(first: 10) {
          edges {
            node {
              restaurantByRestaurant {
                name
              }
            }
          }
        }
      }
    `
  }
});
