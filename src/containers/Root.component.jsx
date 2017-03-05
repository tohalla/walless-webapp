import React from 'react';
import {connect} from 'react-redux';

import MainNavigation from 'navigation/MainNavigation.component';
import UserNavigation from 'navigation/UserNavigation.component';
import Notifications from 'notifications/Notifications.component';
import mdl from 'mdl/mdl';
import DevTools from 'DevTools';
import {setLanguage} from 'util/translation';

class Root extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  };
  componentWillMount() {
    this.props.setLanguage('en');
  }
  render = () => (
    <div className="site mdl-layout mdl-js-layout mdl-layout--no-desktop-drawer-button">
      <Notifications />
      <div className="mdl-layout__header">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">{'Walless'}</span>
          <MainNavigation />
          <div className="mdl-layout-spacer" />
          <UserNavigation />
        </div>
      </div>
      <div className="mdl-layout__drawer">
        <span className="mdl-layout-title">{'Walless'}</span>
        <MainNavigation />
        <div className="mdl-layout-spacer" />
        <UserNavigation />
      </div>
      <main className="mdl-layout__content">
        <div className="page-content">
          {this.props.children}
        </div>
        <footer className="mdl-mini-footer" />
      </main>
      {process.env.NODE_ENV === 'production' ? null : <DevTools />}
    </div>
  );
}

export default connect(null, {setLanguage})(mdl(Root));
