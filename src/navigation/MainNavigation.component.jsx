import React from 'react';
import {Link} from 'react-router';

const menuItems = [
  {
    path: '/home',
    label: 'Home'
  },
  {
    path: '/restaurant',
    label: 'My restaurant'
  },
  {
    path: '/settings',
    label: 'Settings'
  }
];

export default class MainNavigation extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  render() {
    return (
      <nav className="mdl-navigation">
        {
          menuItems.map((item, key) =>
            <Link
                className={
                  'main-navigation__link mdl-navigation__link' + (
                    this.context.router.isActive(item.path) ?
                      ' main-navigation__link--active' : ''
                  )
                }
                key={key}
                to={item.path}
            >
              {item.label}
            </Link>
          )
        }
      </nav>
    );
  }
}
