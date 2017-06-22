import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';

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
    translationKey: 'navigation.settings',
    requireAuthentication: true
  },
  {
    path: '/contact',
    translationKey: 'navigation.contactUs'
  }
];

const mapStateToProps = state => ({
  t: state.util.translation.t,
  routing: state.util.routing
});

class MainNavigation extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  render() {
    const {router: {location}} = this.context;
    const {t, account} = this.props;
    return (
      <nav className="mdl-navigation main-navigation">
        {
          menuItems
            .filter(item => !item.requireAuthentication || account)
            .map((item, index) => (
              <Link
                  className={
                    'main-navigation__link mdl-navigation__link' + (
                      location.pathname.indexOf(item.path) === 0 &&
                      (item.path !== '/' || location.pathname === '/') ?
                        ' main-navigation__link--active' : ''
                    )
                  }
                  key={index}
                  to={item.path}
              >
                {t(item.translationKey)}
              </Link>
          ))
        }
      </nav>
    );
  }
}

export default compose(
  getActiveAccount
)(connect(mapStateToProps, {})(MainNavigation));
