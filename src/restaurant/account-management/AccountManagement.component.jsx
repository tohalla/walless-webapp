import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import ReactTable from 'react-table';

import {
  getAccountsByRestaurant,
  getAccountRolesForRestaurant
} from 'graphql/restaurant/restaurant.queries';
import {isLoading} from 'util/shouldComponentUpdate';

const mapStateToProps = state => ({t: state.util.translation.t});

class AccountManagement extends React.Component {
  shouldComponentUpdate = newProps => !isLoading(newProps);
  render() {
    const {getAccountsByRestaurant: {accounts}} = this.props;
    return accounts.length ? (
      <div className={`container container--padded container--distinct`}>
        <ReactTable
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
            defaultPageSize={accounts.length}
            showPageJump={false}
            showPageSizeOptions={false}
            showPagination={false}
        />
      </div>
    ) : null;
  }
};

export default compose(
  connect(mapStateToProps, {}),
  getAccountsByRestaurant, getAccountRolesForRestaurant
)(AccountManagement);
