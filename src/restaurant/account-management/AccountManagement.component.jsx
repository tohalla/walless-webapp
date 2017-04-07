import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';

import {
  getAccountsByRestaurant,
  getAccountRolesForRestaurant
} from 'graphql/restaurant/restaurant.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

class AccountManagement extends React.Component {
  render() {
    const {getAccountsByRestaurant: {accounts}} = this.props;
    return (
      <div className={`container container--distinct`}>
        <table>
          <thead>
            <tr>
              <th>{'id'}</th>
              <th>{'name'}</th>
              <th>{'role'}</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(accounts) && accounts.map((restaurantAccount, index) => {
              const {
                accountByAccount: {id, firstName, lastName},
                accountRoleByRole: role
              } = restaurantAccount;
              return (
                <tr key={index}>
                  <td>{id}</td>
                  <td>{`${firstName} ${lastName}`}</td>
                  <td>{role.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default compose(
  getAccountsByRestaurant, getAccountRolesForRestaurant
)(connect(mapStateToProps, {})(AccountManagement));
