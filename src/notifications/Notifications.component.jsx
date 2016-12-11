import React from 'react';
import {connect} from 'react-redux';

import Notification from 'notifications/Notification.Component';

const mapStateToProps = state => ({
  notifications: state.notifications
});

class Notifications extends React.Component {
  render() {
    const {notifications} = this.props;
    return (
      <div className="notifications__container">
        {
          notifications.map((notification, index) =>
            <Notification key={index} notification={notification} />
          )
        }
      </div>
    );
  }
}

export default connect(
  mapStateToProps, {}
)(Notifications);
