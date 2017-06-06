import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

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
      <div
          className={
            'notification' + (
              notification.has('type') ?
                ` notification--${notification.get('type')}` : ''
            )
          }
      >
        <div className="notification__content">
          {notification.get('content')}
        </div>
        <div className="notification__actions">
          <button
              className="button--plain button--light"
              onClick={this.handleDelete}
              type="button"
          >
            {'x'}
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  null, {deleteNotification}
)(Notification);
