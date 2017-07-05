import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';

import Button from 'components/Button.component';
import Authenticate from 'account/Authenticate.component';
import authenticationHandler from 'util/auth';
import {getActiveAccount} from 'graphql/account/account.queries';
import apolloClient from 'apolloClient';

const mapStateToProps = state => ({t: state.util.translation.t});

class UserNavigation extends React.Component {
  handleLogout = async event => {
    event.preventDefault();
    await authenticationHandler.logout();
    apolloClient.resetStore();
  }
  render() {
    const {t, account, getActiveAccount: {loading} = {}} = this.props;
    return loading ? null : (
      <nav className="mdl-navigation">
        {account ?
          <div>
            <span>
              {t('account.authenticated', {
                name: account.firstName
              })}
            </span>
            <Button
                light
                onClick={this.handleLogout}
                plain
                type="button"
            >
              {t('account.signOut')}
            </Button>
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
