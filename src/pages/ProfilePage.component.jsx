import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {account} from 'walless-graphql';

import User from 'account/User.component';
import PageContent from 'containers/PageContent.component';
import WithActions from 'components/WithActions.component';
import loadable from 'decorators/loadable';

@loadable()
@translate()
@Radium
class ProfilePage extends React.Component {
  static propTypes = {
    account: PropTypes.object
  };
  render() {
    const {account = {}} = this.props;
    return <PageContent>
      <WithActions
        hideActions
      >
        <User user={account} />
      </WithActions>
    </PageContent>;
  }
}

export default compose(
  account.getActiveAccount
)(ProfilePage);
