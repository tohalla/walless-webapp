import React from 'react';
import Cookie from 'js-cookie';
import {Map} from 'immutable';

import MainNavigation from '../navigation/MainNavigation.component';
import UserNavigation from '../navigation/UserNavigation.container';
import mdl from '../mdl/mdl';
import {authenticate, getActiveAccount} from '../util/auth';

class Root extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  };
  static childContextTypes = {
    account: React.PropTypes.object,
    location: React.PropTypes.object
  };
  constructor(props, context) {
    super(props, context);
    if (Cookie.get('Authorization')) {
      (async () => {
        const account = await getActiveAccount(Cookie.get('Authorization'));
        if (account instanceof Error) {
          Cookie.remove('Authorization');
          this.setState(({data}) => ({data: new Map({
            isAuthenticated: false
          })}));
          return account;
        }
        this.setState(({data}) => ({data: data.merge({
          isAuthenticated: true,
          account
        })}));
      })();
    }
  }
  state = {
    data: new Map()
  };
  getChildContext = () => ({
    location: this.props.location,
    account: Object.assign({}, {
      authenticate: async (email, password) => {
        Cookie.remove('Authorization');
        const token = await authenticate(email, password);
        const account = await getActiveAccount(token);
        if (token instanceof Error || account instanceof Error) {
          this.setState(({data}) => ({data: new Map({isAuthenticated: false})}));
          return token instanceof Error ? token : account;
        }
        Cookie.set('Authorization', token);
        window.location.reload();
      },
      logout: () => {
        Cookie.remove('Authorization');
        window.location.reload();
      }
    }, {data: this.state.data})
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

