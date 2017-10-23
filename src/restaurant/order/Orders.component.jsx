import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {uniqBy, get, set} from 'lodash/fp';
import {order} from 'walless-graphql';

import OrdersFilter from 'restaurant/order/OrdersFilter.component';
import Table from 'components/Table.component';
import Button from 'components/Button.component';
import loadable from 'decorators/loadable';
import WithActions from 'components/WithActions.component';
import {normal} from 'styles/spacing';
import colors from 'styles/colors';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  timeFormat: state.util.translation.timeFormat,
  language: state.util.translation.language
});

@loadable()
@Radium
class Orders extends React.Component {
  static PropTypes = {
    restaurant: PropTypes.object.isRequired
  };
  state = {action: {key: 'filter'}, filters: {state: 'pending'}};
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
    return items.length ? (
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
              accessor: data => get(['i18n', language, 'name'])(data),
              aggregate: ([value]) => value
            }
          ]}
          data={items}
          defaultPageSize={uniqBy(item => item.id)(items).length
          }
          pivotBy={['id']}
          style={{padding: normal, background: colors.background}}
      />
    ) : null;
  };
  handleFiltersChange = filters => this.setState({filters});
  setFilterValue = (filter, value) => () =>
    this.setState(set(['filters', filter])(value)(this.state));
  handleActionChange = action => this.setState({action});
  render() {
    const {orders, t, restaurant, ...props} = this.props;
    const {action, filters} = this.state;
    const data = orders.filter(order =>
      (
        !get(['servingLocations', 'length'])(filters) ||
        filters.servingLocations.indexOf(get(['servingLocation', 'id'])(order)) > -1
      ) && (
        filters.state === 'all' ||
        (filters.state === 'completed' && order.completed) ||
        (filters.state === 'pending' && !order.completed)
      )
    );
    return (
      <WithActions
          {...props}
          action={action ? action.key : undefined}
          actions={{
            filter: {
              label: t('restaurant.order.action.filter'),
              item: (
                <OrdersFilter
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
        {data.length ?
          <Table
              SubComponent={this.handleRenderMenuItems}
              columns={[
                {
                  Header: t('restaurant.order.servingLocation'),
                  id: 'servingLocation',
                  accessor: data => (
                    <Button
                        onClick={this.setFilterValue('servingLocations', [data.servingLocation.id])}
                        plain
                    >
                      {data.servingLocation.name}
                    </Button>
                  )
                },
                {
                  Header: t('restaurant.order.createdAt'),
                  width: 10 + t('restaurant.order.createdAt').length*10,
                  id: 'createdAt',
                  accessor: data => data.createdAt.toLocaleTimeString()
                },
                {
                  Header: t('restaurant.order.createdBy'),
                  id: 'createdBy',
                  minWidth: 140,
                  accessor: data => `${data.createdBy.firstName} ${data.createdBy.lastName}`
                },
                {
                  Header: t('restaurant.order.acceptedAt'),
                  accessor: data => data.accepted ? data.accepted.toLocaleTimeString() : (
                    <Button onClick={this.handleAcceptOrder(data)} plain>
                      {t('restaurant.order.accept')}
                    </Button>
                  ),
                  id: 'acceptedAt'
                },
                {
                  Header: t('restaurant.order.completedAt'),
                  accessor: data => data.completed ?
                    data.completed.toLocaleTimeString() : (
                      <Button onClick={this.handleCompleteOrder(data)} plain>
                        {t('restaurant.order.complete')}
                      </Button>
                    ),
                  id: 'completed'
                },
                {
                  Header: t('restaurant.order.items'),
                  id: 'items',
                  width: 10 + t('restaurant.order.items').length*10,
                  accessor: data => (data.items || []).length
                }
              ]}
              data={data}
              defaultPageSize={data.length}
              showPageJump={false}
              showPageSizeOptions={false}
              showPagination={false}
          />
          : null
        }
      </WithActions>
    );
  }
}

export default compose(
  connect(mapStateToProps, {}),
  order.getOrdersByRestaurant,
  order.updateOrder
)(Orders);
