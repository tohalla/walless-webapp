import React from 'react';
import PropTypes from 'prop-types';
import {StyleRoot} from 'radium';

import MainNavigation from 'navigation/MainNavigation.component';
import Notifications from 'notifications/Notifications.component';
import DevTools from 'DevTools';
import colors from 'styles/colors';

export default class Root extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };
  render() {
    return (
      <StyleRoot style={styles.root}>
        <Notifications />
        <MainNavigation />
        <div style={styles.content}>
          {this.props.children}
        </div>
        {process.env.NODE_ENV === 'production' ? null : <DevTools />}
      </StyleRoot>
    );
  };
}

const styles = {
  root: {
    backgroundColor: colors.gallery,
    color: colors.foregroundDark,
    flex: 1,
    fontFamily: 'Open Sans, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  content: {
    display: 'flex',
    flex: 1
  }
};

