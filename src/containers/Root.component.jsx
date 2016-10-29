import React from 'react';

import MainNavigation from 'navigation/MainNavigation.component';
import UserNavigation from 'navigation/UserNavigation.container';
import mdl from 'mdl/mdl';
import authenticationHandler from 'util/auth';

class Root extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  };
  static childContextTypes = {
    authenticationHandler: React.PropTypes.object,
    location: React.PropTypes.object
  };
  getChildContext = () => ({
    location: this.props.location,
    authenticationHandler
  });
  render = () => (
    <div className="site mdl-layout mdl-js-layout mdl-layout--no-desktop-drawer-button">
      <div className="mdl-layout__header">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">{'Ulosko'}</span>
          <MainNavigation />
          <div className="mdl-layout-spacer" />
          <UserNavigation />
        </div>
      </div>
      <div className="mdl-layout__drawer">
        <span className="mdl-layout-title">{'Ulosko'}</span>
        <MainNavigation />
        <div className="mdl-layout-spacer" />
        <UserNavigation />
      </div>
      <main className="mdl-layout__content">
        <div className="flex">
          {this.props.children}
        </div>
        <footer className="mdl-mini-footer" />
      </main>
    </div>
  );
}

export default mdl(Root);

