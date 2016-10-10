import React from 'react';
import Cookie from 'js-cookie';
import {Map} from 'immutable';
// import Relay from 'react-relay';

import MainNavigation from '../navigation/MainNavigation.component';
import UserNavigation from '../navigation/UserNavigation.container';
import {authenticate, getActiveAccount} from '../util/auth';

export default class Root extends React.Component {
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
            authenticated: false
          })}));
          return account;
        }
        this.setState(({data}) => ({data: data.merge({
          authenticated: true,
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
          this.setState(({data}) => ({data: new Map({authenticated: false})}));
          return token instanceof Error ? token : account;
        }
        Cookie.set('Authorization', token);
        this.setState({account});
        this.setState(({data}) => ({data: data.merge({
          authenticated: true,
          account
        })}));
      },
      logout: () => {
        Cookie.remove('Authorization');
        this.setState(({data}) => ({data: new Map({authenticated: false})}));
      }
    }, {data: this.state.data})
  });
  render = () => (
    <div className="site mdl-layout mdl-js-layout">
      <div className="mdl-layout__header">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">{'Ulosko'}</span>
          <MainNavigation />
          <div className="mdl-layout-spacer" />
          <UserNavigation />
        </div>
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

// TODO: relay container
