import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Button from 'components/Button.component';
import {deleteNotification} from 'notifications/notification';

class Notification extends React.Component {
  static propTypes = {
    notification: PropTypes.object.isRequired
  };
  handleDelete = e => {
    e.preventDefault();
    const {deleteNotification, notification} = this.props;
    deleteNotification(notification);
  };
  render() {
    const {notification} = this.props;
    return (
      <div className="notification">
        <div className={`notification__indicator notification__indicator--${notification.get('type') || 'neutral'}`} />
        <div className="notification__content">
          {notification.get('content')}
        </div>
        <div className="notification__actions">
          <Button
              onClick={this.handleDelete}
              plain
              type="button"
          >
            <i className="material-icons mdi mdi-18px">{'close'}</i>
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(
  null, {deleteNotification}
)(Notification);
