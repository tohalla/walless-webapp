import React from 'react';
import PropTypes from 'prop-types';
import {StyleRoot} from 'radium';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import Restaurant from 'pages/Restaurant.component';
import MainNavigation from 'navigation/MainNavigation.component';
import Notifications from 'notifications/Notifications.component';
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
        <MainNavigation {...this.props} />
        <div style={styles.content}>
          <Switch>
            <Route path="/documentation" />
            <Route path="/contact" />
            <Route component={Restaurant} path="/:restaurant?" />
            <Redirect path="*" to="/" />
          </Switch>
        </div>
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

