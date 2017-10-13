import React from 'react';
import {connect} from 'react-redux';
import {compose, withApollo} from 'react-apollo';
import Radium from 'radium';
import {account} from 'walless-graphql';

import {minimal} from 'styles/spacing';
import Button from 'components/Button.component';
import authenticationHandler from 'util/auth';

const mapStateToProps = state => ({t: state.util.translation.t});

@Radium
class UserNavigation extends React.Component {
  handleLogout = async event => {
    event.preventDefault();
    await authenticationHandler.logout();
  }
  render() {
    const {t, account, getActiveAccount: {loading} = {}} = this.props;
    return loading ? null : account && (
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
    );
  }
}

export default withApollo(
  compose(
    connect(mapStateToProps, {}),
    account.getActiveAccount
  )(UserNavigation)
);
