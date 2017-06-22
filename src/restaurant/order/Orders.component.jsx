import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {get} from 'lodash/fp';
import ReactTable from 'react-table';

import {getOrdersByRestaurant} from 'walless-graphql/restaurant/restaurant.queries';
import {isLoading} from 'util/shouldComponentUpdate';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  language: state.util.translation.language,
  filter: get(['form', 'orderFilter', 'values'])(state)
});

class Orders extends React.Component {
  static PropTypes = {
    restaurant: PropTypes.object.isRequired
  };
  shouldComponentUpdate = newProps => !isLoading(newProps);
  handleRenderRow = ({original}) => (
    <div>
      {original.items.map((item, index) => (
        <div key={index}>{JSON.stringify(item.menuItem)}</div>
      ))}
    </div>
  );
  render() {
    const {getOrdersByRestaurant: {orders}} = this.props;
    return orders.length ? (
      <div className={`container container--padded container--distinct`}>
        <ReactTable
            SubComponent={this.handleRenderRow}
            columns={[
              {
                Header: 'servingLocation',
                id: 'servingLocation',
                accessor: data => (
                  <div className="trigger">{data.servingLocation.name}</div>
                )
              },
              {
                Header: 'placeholder',
                accessor: 'createdAt'
              },
              {
                Header: 'placeholder',
                id: 'orderer',
                minWidth: 140,
                accessor: data => `${data.orderer.firstName} ${data.orderer.lastName}`
              },
              {
                Header: 'placeholder',
                accessor: 'accepted'
              },
              {
                Header: 'placeholder',
                accessor: 'paid'
              },
              {
                Header: 'placeholder',
                accessor: 'completed'
              },
              {
                Header: 'placeholder',
                accessor: 'message'
              },
              {
                Header: 'placeholder',
                id: 'items',
                accessor: data => (data.items || []).length
              }
            ]}
            data={orders}
            defaultPageSize={orders.length}
            showPageJump={false}
            showPageSizeOptions={false}
            showPagination={false}
        />
      </div>
    ) : null;
  }
}

export default compose(
  connect(mapStateToProps, {}),
  getOrdersByRestaurant
)(Orders);
