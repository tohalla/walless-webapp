import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';

import Table from 'components/Table.component';
import {
  getAccountsByRestaurant,
  getAccountRolesForRestaurant
} from 'graphql/account/account.queries';
import loadable from 'decorators/loadable';

const mapStateToProps = state => ({t: state.util.translation.t});

@loadable()
class AccountManagement extends React.Component {
  render() {
    const {accounts} = this.props;
    return accounts.length ? (
      <Table
          columns={[
            {
              Header: 'Id',
              id: 'Id',
              accessor: data => data.account.id
            },
            {
              Header: 'name',
              id: 'name',
              minWidth: 140,
              accessor: data => `${data.account.firstName} ${data.account.lastName}`
            },
            {
              Header: 'role',
              id: 'role',
              accessor: data => data.role.name
            }
          ]}
          data={accounts}
      />
    ) : null;
  }
};

export default compose(
  connect(mapStateToProps, {}),
  getAccountsByRestaurant, getAccountRolesForRestaurant
)(AccountManagement);
