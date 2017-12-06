import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {connect} from 'react-redux';
import {notificationsZIndex} from 'styles/zIndex';
import Notification from 'notifications/Notification';

@Radium
class Notifications extends React.Component {
  static propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape({
      content: PropTypes.string
    }))
  };
  render() {
    const {notifications} = this.props;
    return (
      <div style={styles.container}>
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
  state => ({notifications: state.notifications})
)(Notifications);

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    right: 0,
    flexDirection: 'column',
    alignItems: 'flex-end',
    display: 'flex',
    zIndex: notificationsZIndex
  }
};
