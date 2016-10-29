import React from 'react';
import {compose} from 'react-apollo';

import {getActiveAccount} from 'queries/account.queries';
import Authenticate from 'account/Authenticate.component';

class UserNavigation extends React.Component {
  static contextTypes = {
    t: React.PropTypes.func,
    authenticationHandler: React.PropTypes.object
  };
  static propTypes = {
    me: React.PropTypes.object
  }
  render() {
    const {t, authenticationHandler} = this.context;
    const {me} = this.props;
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

export default compose(
  getActiveAccount
)(UserNavigation);
