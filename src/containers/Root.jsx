import React from 'react';
import PropTypes from 'prop-types';
import {StyleRoot} from 'radium';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import {compose} from 'react-apollo';
import {account} from 'walless-graphql';
import {translate} from 'react-i18next';
import {get} from 'lodash/fp';

import RestaurantPage from 'pages/RestaurantPage';
import ProfilePage from 'pages/ProfilePage';
import MainNavigation from 'navigation/MainNavigation';
import Notifications from 'notifications/Notifications';
import colors from 'styles/colors';

@translate()
@compose(account.getActiveAccount)
export default class Root extends React.Component {
  static propTypes = {
    i18n: PropTypes.shape({
      language: PropTypes.string
    }),
    account: PropTypes.shape({language: PropTypes.string}),
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };
  componentWillReceiveProps({i18n, account}) {
    const language = get(['language'])(account);
    if (
      language &&
      language !== i18n.language &&
      language !== get(['account', 'language'])(this.props)
    ) {
      i18n.changeLanguage(language);
    }
  };
  render() {
    return (
      <StyleRoot style={styles.root}>
        <Notifications />
        <MainNavigation {...this.props} />
        <div style={styles.content}>
          <Switch>
            <Route path='/documentation' />
            <Route path='/contact' />
            <Route component={ProfilePage} path='/profile' />
            <Route component={RestaurantPage} path='/:restaurant?' />
            <Redirect path='*' to='/' />
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
