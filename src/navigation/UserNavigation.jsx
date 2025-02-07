import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {compose, withApollo} from 'react-apollo';
import {account} from 'walless-graphql';

import {minimal} from 'styles/spacing';
import Button from 'components/Button';
import authenticationHandler from 'util/auth';

@translate()
@Radium
class UserNavigation extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    account: PropTypes.shape({
      firstName: PropTypes.string
    }),
    getActiveAccount: PropTypes.shape({loading: PropTypes.bool})
  };
  handleLogout = async event => {
    event.preventDefault();
    await authenticationHandler.logout();
  };
  render() {
    const {t, account, getActiveAccount: {loading} = {}} = this.props;
    return !loading && account && (
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

export default withApollo(compose(account.getActiveAccount)(UserNavigation));
