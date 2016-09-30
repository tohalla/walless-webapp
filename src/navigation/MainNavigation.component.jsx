import React from 'react';
import {Link} from 'react-router';
import {fromJS} from 'immutable';

const menuItems = fromJS([
  {
    path: '/home',
    label: 'Home'
  },
  {
    path: '/restaurant',
    label: 'My restaurant',
    requireAuthentication: true
  },
  {
    path: '/documentation',
    label: 'Documentation'
  },
  {
    path: '/contact',
    label: 'Contact us'
  }
]);

export default class MainNavigation extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  render() {
    return (
      <nav className="mdl-navigation main-navigation">
        {
          menuItems.map((item, key) =>
            <Link
                className={
                  'main-navigation__link mdl-navigation__link' + (
                    this.context.router.isActive(item.get('path')) ?
                      ' main-navigation__link--active' : ''
                  )
                }
                key={key}
                to={item.get('path')}
            >
              {item.get('label')}
            </Link>
          )
        }
      </nav>
    );
  }
}
