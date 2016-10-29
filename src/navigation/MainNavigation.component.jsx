import React from 'react';
import {Link} from 'react-router';

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
    t: React.PropTypes.func
  }
  render() {
    const {t, router: {location}} = this.context;
    return (
      <nav className="mdl-navigation main-navigation">
        {
          menuItems.map((item, index) =>
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
          )
        }
      </nav>
    );
  }
}
