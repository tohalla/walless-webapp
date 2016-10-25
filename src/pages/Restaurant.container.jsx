import React from 'react';
import Relay from 'react-relay';

import WithSideBar from '../containers/WithSideBar.component';

class Restaurant extends React.Component {
  static propTypes = {
    me: React.PropTypes.object,
    relay: React.PropTypes.object.isRequired
  };
  render() {
    console.log(this.props.me);
    return (
      <WithSideBar>
        {'content'}
      </WithSideBar>
    );
  }
}

export default Relay.createContainer(Restaurant, {
  fragments: {
    me: () => Relay.QL`
      fragment on Account {
        firstName
        lastName
        restaurantAccountNodesByAccount(first: 10) {
          edges {
            node {
              restaurantByRestaurant
            }
          }
        }
      }
    `
  }
});
