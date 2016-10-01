import React from 'react';
import {Link} from 'react-router';
import {fromJS} from 'immutable';

const menuItems = fromJS([
  {
    path: '/home',
    translationKey: 'home'
  },
  {
    path: '/restaurant',
    translationKey: 'myRestaurant',
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
]);

export default class MainNavigation extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    t: React.PropTypes.func
  }
  render() {
    const {t, router} = this.context;
    return (
      <nav className="mdl-navigation main-navigation">
        {
          menuItems.map((item, key) =>
            <Link
                className={
                  'main-navigation__link mdl-navigation__link' + (
                    router.isActive(item.get('path')) ?
                      ' main-navigation__link--active' : ''
                  )
                }
                key={key}
                to={item.get('path')}
            >
              {t(item.get('translationKey'))}
            </Link>
          )
        }
      </nav>
    );
  }
}
