import React from 'react';
import {connect} from 'react-redux';
import {compose, withApollo} from 'react-apollo';
import Radium from 'radium';

import {minimal} from 'styles/spacing';
import Button from 'components/Button.component';
import Authenticate from 'account/Authenticate.component';
import authenticationHandler from 'util/auth';
import {getActiveAccount} from 'graphql/account/account.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

@Radium
class UserNavigation extends React.Component {
  handleLogout = async event => {
    event.preventDefault();
    await authenticationHandler.logout();
    this.props.client.resetStore();
  }
  render() {
    const {t, account, getActiveAccount: {loading} = {}} = this.props;
    return loading ? null
      : account ? (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{padding: minimal}}>
            {t('account.authenticated', {
              name: account.firstName
            })}
          </div>
          <Button onClick={this.handleLogout} plain>
            {t('account.signOut')}
          </Button>
        </div>
      ) : <Authenticate />;
  }
}

export default withApollo(
  compose(
    connect(mapStateToProps, {}),
    getActiveAccount
  )(UserNavigation)
);
