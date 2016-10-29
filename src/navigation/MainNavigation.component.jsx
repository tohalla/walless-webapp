import React from 'react';
import {Link} from 'react-router';
import {map} from 'lodash/fp';

const menuItems = [
  {
    path: '/',
    translationKey: 'home'
  },
  {
    path: '/restaurant',
    translationKey: 'restaurant',
    requireAuthentication: true
  },
  {
    path: '/documentation',
    translationKey: 'documentation'
  },
  {
    path: '/contact',
    translationKey: 'contactUs'
  }
];

export default class MainNavigation extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    t: React.PropTypes.func,
    location: React.PropTypes.any
  }
  render() {
    const {t, router, location} = this.context;
    return (
      <nav className="mdl-navigation main-navigation">
        {
          map(item =>
            <Link
                className={
                  'main-navigation__link mdl-navigation__link' + (
                    location.pathname === item.path ||
                    (item.path !== '/' && router.isActive(item.path)) ?
                      ' main-navigation__link--active' : ''
                  )
                }
                key={menuItems.indexOf(item)}
                to={item.path}
            >
              {t(item.translationKey)}
            </Link>
          )(menuItems)
        }
      </nav>
    );
  }
}
