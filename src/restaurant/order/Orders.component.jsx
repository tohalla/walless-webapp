import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {uniqBy, get, set} from 'lodash/fp';
import moment from 'moment';

import OrdersFilter from 'restaurant/order/OrdersFilter.component';
import Table from 'components/Table.component';
import Button from 'components/Button.component';
import {getOrdersByRestaurant} from 'walless-graphql/restaurant/order.queries';
import loadable from 'decorators/loadable';
import {updateOrder} from 'graphql/restaurant/order.mutations';
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
  state = {action: {key: 'filter'}, filters: {}};
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
    ) : null;
  };
  handleFiltersChange = filters => this.setState({filters});
  handleActionChange = action => this.setState({action});
  handleActionSelect = action => () => this.handleActionChange(action);
  render() {
    const {orders, t, restaurant, timeFormat, ...props} = this.props;
    const {action, filters} = this.state;
    const data = orders.filter(order =>
      !get(['servingLocations', 'length'])(filters) ||
      filters.servingLocations.indexOf(get(['servingLocation', 'id'])(order)) > -1
    );
    return (
      <WithActions
          {...props}
          action={action ? action.key : undefined}
          actions={{
            filter: {
              label: t('restaurant.menuItem.action.filter'),
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
                  accessor: data =>
                    data.servingLocation.name
                },
                {
                  Header: t('restaurant.order.createdAt'),
                  id: 'createdAt',
                  accessor: data => moment(data.createdAt).format(timeFormat)
                },
                {
                  Header: t('restaurant.order.createdBy'),
                  id: 'createdBy',
                  minWidth: 140,
                  accessor: data => `${data.createdBy.firstName} ${data.createdBy.lastName}`
                },
                {
                  Header: t('restaurant.order.acceptedAt'),
                  accessor: data => data.accepted ? moment(data.accepted).format(timeFormat) : (
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
                    moment(data.completed).format(timeFormat): (
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
  getOrdersByRestaurant,
  updateOrder
)(Orders);
