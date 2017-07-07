import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import {hasIn} from 'lodash/fp';
import ReactTable from 'react-table';

import Button from 'components/Button.component';
import WithActions from 'components/WithActions.component';
import {
  getServingLocationsByRestaurant
} from 'graphql/restaurant/restaurant.queries';
import ServingLocationForm from
  'restaurant/serving-location/ServingLocationForm.component';
import {isLoading} from 'util/shouldComponentUpdate';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  filter: hasIn(['form', 'servingLocationFilter', 'values'])(state) ?
    state.form.servingLocationFilter.values : {}
});

class ServingLocations extends React.Component {
  static PropTypes = {
    action: PropTypes.shape({
      name: PropTypes.string.isRequired,
      item: PropTypes.object
    }),
    selectedItems: PropTypes.instanceOf(Set),
    servingLocations: PropTypes.arrayOf(PropTypes.object),
    restaurant: PropTypes.object.isRequired
  };
  static defaultProps = {
    selectedItems: new Set()
  };
  constructor(props) {
    super(props);
    this.state = {
      action: props.action
    };
  }
  shouldComponentUpdate = newProps => !isLoading(newProps);
  handleActionChange = (action = {}) => event => {
    this.setState({action});
  };
  handleServingLocationSubmit = () => {
    this.setState({action: null});
    this.props.getServingLocationsByRestaurant.refetch();
  };
  filterItems = item =>
    !this.props.filter.name ||
    item.name.toLowerCase().indexOf(this.props.filter.name.toLowerCase()) > -1;
  render() {
    const {
      servingLocations,
      restaurant,
      plain,
      t
    } = this.props;
    const {action} = this.state;
    const actions = {
      filter: {
        label: t('restaurant.servingLocations.action.filter'),
        item: (
          <div />
        )
      },
      edit: {
        hide: true,
        hideReturn: true,
        hideItems: true,
        item: (
          <ServingLocationForm
              onCancel={this.handleActionChange()}
              onSubmit={this.handleServingLocationSubmit}
              restaurant={restaurant}
              servingLocation={action ? action.servingLocation : null}
          />
        )
      },
      new: {
        label: t('restaurant.servingLocations.action.create'),
        hideReturn: true,
        hideItems: true,
        item: (
          <ServingLocationForm
              onCancel={this.handleActionChange()}
              onSubmit={this.handleServingLocationSubmit}
              restaurant={restaurant}
          />
        )
      }
    };
    return (
      <WithActions
          action={action ? action.key : undefined}
          actions={actions}
          containerClass={plain ? 'container' : 'container container--padded container--distinct'}
          onActionChange={this.handleActionChange}
      >
        {servingLocations.length ?
          <ReactTable
              columns={[
                {
                  Header: t('restaurant.servingLocations.name'),
                  accessor: 'name'
                },
                {
                  Header: t('restaurant.servingLocations.actions'),
                  id: 'edit',
                  accessor: data => (
                    <Button onClick={this.handleActionChange({key: 'edit', servingLocation: data})} plain>
                      {t('restaurant.servingLocations.action.edit')}
                    </Button>
                  ),
                  width: 100
                }
              ]}
              data={servingLocations}
              defaultPageSize={servingLocations.length}
              showPageJump={false}
              showPageSizeOptions={false}
              showPagination={false}
          />
        : ''}
      </WithActions>
    );
  }
}

export default compose(getServingLocationsByRestaurant)(
  connect(mapStateToProps, {})(ServingLocations)
);
