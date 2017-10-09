import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Logo from 'components/Logo.component';
import Navigation from 'navigation/Navigation.component';
import NavigationItem from 'navigation/NavigationItem.component';
import colors from 'styles/colors';
import shadow from 'styles/shadow';
import {normal} from 'styles/spacing';
import UserNavigation from 'navigation/UserNavigation.component';
import {getActiveAccount} from 'graphql/account/account.queries';

const menuItems = [
  {
    path: '/',
    translationKey: 'navigation.home'
  },
  {
    path: '/restaurant',
    translationKey: 'navigation.restaurant',
    requireAuthentication: true
  },
  {
    path: '/documentation',
    translationKey: 'navigation.documentation'
  },
  {
    path: '/settings',
    translationKey: 'navigation.settings.settings',
    requireAuthentication: true
  },
  {
    path: '/contact',
    translationKey: 'navigation.contactUs'
  }
];

const mapStateToProps = state => ({
  t: state.util.translation.t
});

@Radium
class MainNavigation extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  render() {
    const {t, account, location} = this.props;
    return (
      <div style={[styles.container, shadow.small]}>
        <Logo />
        <Navigation style={styles.navigation}>
          {menuItems
            .filter(item => !item.requireAuthentication || account)
            .map((item, index) => (
              <NavigationItem
                  active={
                    location.pathname.indexOf(item.path) === 0 &&
                    (item.path !== '/' || location.pathname === '/')
                  }
                  activeStyle={styles.itemActive}
                  key={index}
                  path={item.path}
                  style={styles.item}
              >
                {t(item.translationKey)}
              </NavigationItem>
          ))}
        </Navigation>
        <UserNavigation />
      </div>
    );
  }
}

export default compose(
  connect(mapStateToProps, {}),
  getActiveAccount
)(MainNavigation);

const styles = {
  container: {
    display: 'flex',
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: `0 ${normal}`,
    backgroundColor: colors.headerBackground,
    color: colors.headerForeground
  },
  navigation: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: normal
  },
  item: {
    color: colors.headerForeground,
    textDecoration: 'none',
    padding: normal
  },
  itemActive: {
    textDecoration: 'underline'
  }
};
