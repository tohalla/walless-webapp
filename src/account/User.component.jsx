import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {account} from 'walless-graphql';

import ItemsWithLabels from 'components/ItemsWithLabels.component';
import loadable from 'decorators/loadable';

@loadable()
@translate()
@Radium
class Profile extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    account: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string,
      lasttName: PropTypes.string
    }).isRequired
  };
  render() {
    const {t, account = {}} = this.props;
    return <div>
      <h3>{`${account.firstName} ${account.lastName}`}</h3>
      <ItemsWithLabels items={[
        {
          label: t('language'),
          item: account.language
        }
      ]} />
    </div>;
  }
}

export default compose(
  account.getActiveAccount
)(Profile);
