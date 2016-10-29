import React from 'react';
import {compose} from 'react-apollo';
import Select from 'react-select';

import WithSideBar from 'containers/WithSideBar.component';
import {getMyRestaurants} from 'queries/restaurant.queries';

class Restaurant extends React.Component {
  static contextTypes = {
    t: React.PropTypes.func
  };
  static propTypes = {
    me: React.PropTypes.object
  };
  render() {
    const {myRestaurants} = this.props;
    console.log(myRestaurants);
    return (
      <WithSideBar
          sideContent={
            <div>
              <Select
                  name="activeRestaurant"
              />
            </div>
          }
      >
        {'content'}
      </WithSideBar>
    );
  }
}

export default compose(
  getMyRestaurants
)(Restaurant);
