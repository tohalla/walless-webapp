import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import {hasIn} from 'lodash/fp';

import ListItems from 'components/ListItems.component';
import {
  getServingLocationsByRestaurant
} from 'graphql/restaurant/restaurant.queries';
import ServingLocation from
  'restaurant/serving-location/ServingLocation.component';
import ServingLocationForm from
  'restaurant/serving-location/ServingLocationForm.component';

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
  handleActionChange = action => event => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({action});
  };
  renderServingLocation = (servingLocation, props) => (
    <ServingLocation
        actions={this.props.plain ? [] : [
          {
            label: this.props.t('edit'),
            onClick: this.handleActionChange({name: 'edit', servingLocation})
          }
        ]}
        className={this.props.selectedItems.has(servingLocation.id) ?
          'container__row selected' : null
        }
        servingLocation={servingLocation}
        {...props}
    />
  );
  handleServingLocationSubmit = () => {
    this.setState({action: null});
    this.props.getServingLocationsByRestaurant.data.refetch();
  };
  filterItems = item =>
    !this.props.filter.name || item.name.indexOf(this.props.filter.name) > -1;
  render() {
    const {
      getServingLocationsByRestaurant: {servingLocations} = {},
      restaurant,
      selectedItems,
      plain,
      t
    } = this.props;
    const {action} = this.state;
    const actions = {
      filter: {
        label: t('restaurant.servingLocations.filter'),
        render: () => (
          <div />
        )
      },
      edit: {
        hide: true,
        hideReturn: true,
        hideItems: true,
        render: () => (
          <ServingLocationForm
              onCancel={this.handleActionChange()}
              onSubmit={this.handleServingLocationSubmit}
              restaurant={restaurant}
              servingLocation={action ? action.servingLocation : null}
          />
        )
      },
      new: {
        label: t('restaurant.servingLocations.create'),
        hideReturn: true,
        hideItems: true,
        render: () => (
          <ServingLocationForm
              onCancel={this.handleActionChange()}
              onSubmit={this.handleServingLocationSubmit}
              restaurant={restaurant}
          />
        )
      }
    };
    return (
      <ListItems
          action={action ? action.name : null}
          actions={actions}
          containerClass={plain ? 'container' : 'container container--padded container--distinct'}
          filterItems={this.filterItems}
          items={servingLocations}
          onActionChange={this.handleActionChange}
          renderItem={this.renderServingLocation}
          selectedItems={selectedItems}
      />
    );
  }
}

export default compose(getServingLocationsByRestaurant)(
  connect(mapStateToProps, {})(ServingLocations)
);
