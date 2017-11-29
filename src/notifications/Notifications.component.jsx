import {connect} from 'react-redux';

import {notificationsZIndex} from 'styles/zIndex';
import Notification from 'notifications/Notification.component';

const mapStateToProps = state => ({
  notifications: state.notifications
});

@Radium
class Notifications extends Component {
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
  mapStateToProps, {}
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
