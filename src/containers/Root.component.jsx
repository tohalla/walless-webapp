import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';

import MainNavigation from 'navigation/MainNavigation.component';
import UserNavigation from 'navigation/UserNavigation.container';
import Notifications from 'notifications/Notifications.component';
import mdl from 'mdl/mdl';
import authenticationHandler from 'util/auth';
import DevTools from 'DevTools';
import {getActiveAccount} from 'graphql/account.queries';
import {setLanguage} from 'util/translation';

class Root extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  };
  static childContextTypes = {
    authenticationHandler: React.PropTypes.object,
    me: React.PropTypes.object
  };
  constructor(props, context) {
    super(props, context);
    props.setLanguage('en');
  }
  getChildContext = () => ({
    authenticationHandler,
    me: this.props.me
  });
  render = () => (
    <div className="site mdl-layout mdl-js-layout mdl-layout--no-desktop-drawer-button">
      <Notifications />
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
        <div className="page-content">
          {this.props.children}
        </div>
        <footer className="mdl-mini-footer" />
      </main>
      {process.env.NODE_ENV === 'production' ? null : <DevTools />}
    </div>
  );
}

export default compose(
  getActiveAccount
)(mdl(
  connect(null, {setLanguage})(Root)
));
