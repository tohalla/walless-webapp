import React from 'react';

import Authenticate from 'account/Authenticate.component';

export default class UserNavigation extends React.Component {
  static contextTypes = {
    t: React.PropTypes.func,
    authenticationHandler: React.PropTypes.object,
    me: React.PropTypes.object
  };
  render() {
    const {t, authenticationHandler, me} = this.context;
    return (
      <nav className="mdl-navigation">
        {me ?
          <div>
            <span>
              {t('account.authenticated', {
                name: me.firstName
              })}
            </span>
            <button
                className="button--plain button--light"
                onClick={authenticationHandler.logout}
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
