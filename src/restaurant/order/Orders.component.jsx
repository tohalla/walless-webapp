import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {uniqBy, get, set} from 'lodash/fp';

import Table from 'components/Table.component';
import Button from 'components/Button.component';
import {getOrdersByRestaurant} from 'walless-graphql/restaurant/order.queries';
import loadable from 'decorators/loadable';
import {updateOrder} from 'graphql/restaurant/order.mutations';
import {normal} from 'styles/spacing';
import colors from 'styles/colors';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  language: state.util.translation.language
});

@loadable()
@Radium
class Orders extends React.Component {
  static PropTypes = {
    restaurant: PropTypes.object.isRequired
  };
  handleAcceptOrder = order => () => this.props.updateOrder(
    set('accepted')(new Date())(order)
  );
  handleCompleteOrder = order => () =>
    this.props.updateOrder(Object.assign(
      {},
      order,
      {
        accepted: order.accepted || new Date(),
        completed: new Date()
      }
    ));
  handleRenderMenuItems = ({original}) => {
    const {t, language} = this.props;
    const items = original.items.map(item => item.menuItem);
    return (
      <Table
          columns={[
            {
              accessor: 'id',
              show: false
            },
            {
              Header: t('restaurant.menuItem.quantity'),
              id: 'quantity',
              accessor: 'id',
              aggregate: values => values.length,
              width: 80
            },
            {
              Header: t('restaurant.menuItem.name'),
              id: 'name',
              accessor: data => get(['information', language, 'name'])(data),
              aggregate: ([value]) => value
            }
          ]}
          data={items}
          defaultPageSize={uniqBy(item => item.id)(items).length
          }
          pivotBy={['id']}
          style={{padding: normal, background: colors.background}}
      />
    );
  }
  render() {
    const {orders, t} = this.props;
    return orders.length ? (
      <Table
          SubComponent={this.handleRenderMenuItems}
          columns={[
            {
              Header: t('restaurant.order.servingLocation'),
              id: 'servingLocation',
              accessor: data =>
                data.servingLocation.name
            },
            {
              Header: t('restaurant.order.createdAt'),
              id: 'createdAt',
              accessor: data => new Date(data.createdAt).toString()
            },
            {
              Header: t('restaurant.order.createdBy'),
              id: 'createdBy',
              minWidth: 140,
              accessor: data => `${data.createdBy.firstName} ${data.createdBy.lastName}`
            },
            {
              Header: t('restaurant.order.acceptedAt'),
              accessor: data => data.accepted ? new Date(data.accepted).toString() : (
                <Button onClick={this.handleAcceptOrder(data)} plain>
                  {t('restaurant.order.accept')}
                </Button>
              ),
              id: 'acceptedAt'
            },
            {
              Header: t('restaurant.order.paidAt'),
              accessor: 'paid'
            },
            {
              Header: t('restaurant.order.completedAt'),
              accessor: data => data.completed ?
                new Date(data.completed).toString() : (
                  <Button onClick={this.handleCompleteOrder(data)} plain>
                    {t('restaurant.order.complete')}
                  </Button>
                ),
              id: 'completed'
            },
            {
              Header: t('restaurant.order.items'),
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
    ) : null;
  }
}

export default compose(
  connect(mapStateToProps, {}),
  getOrdersByRestaurant,
  updateOrder
)(Orders);
