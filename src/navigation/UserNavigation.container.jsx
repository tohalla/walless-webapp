import React from 'react';

import Authenticate from '../account/Authenticate.component';

export default class UserNavigation extends React.Component {
  static contextTypes = {
    t: React.PropTypes.func,
    account: React.PropTypes.object
  };
  render() {
    const {t, account} = this.context;
    return (
      <nav className="mdl-navigation">
        {this.context.account.data.get('isAuthenticated') ?
          <div>
            <span>
              {t('account.authenticated', {
                name: account.data.getIn(['account', 'firstName'])
              })}
            </span>
            <button
                className="button--plain button--light"
                onClick={account.logout}
                type="button"
            >
              {t('account.signOut')}
            </button>
          </div> :
          <Authenticate />
        }
      </nav>
    );
  }
}
