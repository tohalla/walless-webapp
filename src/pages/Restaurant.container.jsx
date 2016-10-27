import React from 'react';

import WithSideBar from 'containers/WithSideBar.component';

export default class Restaurant extends React.Component {
  render() {
    return (
      <WithSideBar>
        {'content'}
      </WithSideBar>
    );
  }
}
