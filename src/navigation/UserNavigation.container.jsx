import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';

import Authenticate from 'account/Authenticate.component';
import authenticationHandler from 'util/auth';
import {getActiveAccount} from 'graphql/account.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

class UserNavigation extends React.Component {
  render() {
    const {t, me} = this.props;
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
)(connect(mapStateToProps, {})(UserNavigation));
