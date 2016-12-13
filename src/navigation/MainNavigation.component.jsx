import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

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
    path: '/settings',
    translationKey: 'settings',
    requireAuthentication: true
  },
  {
    path: '/contact',
    translationKey: 'contactUs'
  }
];

const mapStateToProps = state => ({t: state.util.translation.t});

class MainNavigation extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    me: React.PropTypes.object
  }
  render() {
    const {router: {location}, me} = this.context;
    const {t} = this.props;
    return (
      <nav className="mdl-navigation main-navigation">
        {
          menuItems
            .filter(item => !item.requireAuthentication || me)
            .map((item, index) =>
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

export default connect(mapStateToProps, {})(MainNavigation);
