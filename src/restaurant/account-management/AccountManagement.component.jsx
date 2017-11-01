import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {get} from 'lodash/fp';
import {account} from 'walless-graphql';

import UsersFilter from 'restaurant/account-management/UsersFilter.component';
import WithActions from 'components/WithActions.component';
import Table from 'components/Table.component';
import loadable from 'decorators/loadable';

const mapStateToProps = state => ({t: state.util.translation.t});

@loadable()
class AccountManagement extends React.Component {
  static PropTypes = {
    restaurant: PropTypes.object.isRequired
  };
  state = {action: {key: 'filter'}, filters: {}};
  handleActionChange = action => this.setState({action});
  handleFiltersChange = filters => this.setState({filters});
  render() {
    const {accounts, t, restaurant, ...props} = this.props;
    const {action, filters} = this.state;
    const data = accounts.filter(account =>
      (
        !get(['roles', 'length'])(filters) ||
        filters.roles.indexOf(get(['role', 'id'])(account)) > -1
      ) &&
      (
        !filters.name ||
        `${account.account.firstName} ${account.account.lastName}`
          .toLowerCase().indexOf(filters.name.toLowerCase()) !== -1
      )
    );
    return (
      <WithActions
          {...props}
          action={action ? action.key : undefined}
          actions={{
            filter: {
              label: t('restaurant.userManagement.action.filter'),
              item: (
                <UsersFilter
                    filters={filters}
                    onFiltersChange={this.handleFiltersChange}
                    restaurant={restaurant}
                />
              )
            }
          }}
          forceDefaultAction
          onActionChange={this.handleActionChange}
      >
      {data.length ? (
        <Table
            columns={[
              {
                Header: 'Id',
                id: 'Id',
                accessor: data => data.account.id
              },
              {
                Header: t('account.name'),
                id: 'name',
                minWidth: 140,
                accessor: data => `${data.account.firstName} ${data.account.lastName}`
              },
              {
                Header: t('account.role'),
                id: 'role',
                accessor: data => data.role.name
              }
            ]}
            data={data}
        />
      ) : null}
      </WithActions>
    );
  }
};

export default compose(
  connect(mapStateToProps, {}),
  account.getAccountsByRestaurant, account.getAccountRolesForRestaurant
)(AccountManagement);
