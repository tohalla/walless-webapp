import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import {hasIn, size} from 'lodash/fp';
import {saveAs} from 'file-saver';

import {addNotification} from 'notifications/notification';
import Table from 'components/Table.component';
import Button from 'components/Button.component';
import config from 'config';
import WithActions from 'components/WithActions.component';
import {
  getServingLocationsByRestaurant
} from 'graphql/restaurant/servingLocation.queries';
import ServingLocationForm from
  'restaurant/serving-location/ServingLocationForm.component';
import loadable from 'decorators/loadable';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  filter: hasIn(['form', 'servingLocationFilter', 'values'])(state) ?
    state.form.servingLocationFilter.values : {}
});

@loadable()
class ServingLocations extends React.Component {
  static PropTypes = {
    action: PropTypes.shape({
      name: PropTypes.string.isRequired,
      item: PropTypes.object
    }),
    servingLocations: PropTypes.arrayOf(PropTypes.object),
    restaurant: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      action: props.action,
      selectedItems: new Set(),
      downloadingQR: false
    };
  }
  handleActionChange = action => this.setState({action});
  handleActionSelect = action => () => this.handleActionChange(action);
  handleServingLocationSubmit = () => {
    this.setState({action: null});
    this.props.getServingLocationsByRestaurant.refetch();
  };
  filterItems = item =>
    !this.props.filter.name ||
    item.name.toLowerCase().indexOf(this.props.filter.name.toLowerCase()) > -1;
  toggleSelect = item => {
    const selectedItems = new Set([...this.state.selectedItems]);
    if (selectedItems.has(item.id)) {
      selectedItems.delete(item.id);
    } else {
      selectedItems.add(item.id);
    }
    this.setState({selectedItems});
  };
  handleSelectHeaderClick = event => {
    event.stopPropagation();
    this.setState({selectedItems:
      size(this.state.selectedItems) === size(this.props.servingLocations) ?
        new Set() : new Set(this.props.servingLocations.map(i => i.id))
    });
  };
  getSelectHeaderProps = () => ({onClick: this.handleSelectHeaderClick});
  handleDownloadQR = async() => {
    this.setState({downloadingQR: true});
    const {restaurant, addNotification, t} = this.props;
    const response = await fetch(
      `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.servingLocation.endpoint}/restaurant/${restaurant.id}/` +
      `?servingLocations=[${[...this.state.selectedItems].toString()}]`,
      {
        method: 'GET',
        headers: {'authorization': Cookie.get('Authorization')}
      }
    );
    if (response.ok) {
      saveAs(await response.blob(), 'qr.pdf');
    } else {
      addNotification({type: 'danger', message: t('error.downloadNotAuthorized')});
    }
    this.setState({downloadingQR: false});
  };
  handleSelectHeaderClick = event => {
    event.stopPropagation();
    this.setState({selectedItems:
      size(this.state.selectedItems) === size(this.props.servingLocations) ?
        new Set() : new Set(this.props.servingLocations.map(i => i.id))
    });
  };
  render() {
    const {
      servingLocations,
      restaurant,
      t
    } = this.props;
    const {action, selectedItems, downloadingQR} = this.state;
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
              onCancel={this.handleActionChange}
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
              onCancel={this.handleActionChange}
              onSubmit={this.handleServingLocationSubmit}
              restaurant={restaurant}
          />
        )
      },
      downloadQR: {
        label: t('restaurant.servingLocations.action.downloadQR'),
        onClick: this.handleDownloadQR,
        disabled: !size(selectedItems),
        loading: downloadingQR
      }
    };
    return (
      <WithActions
          action={action ? action.key : undefined}
          actions={actions}
          onActionChange={this.handleActionChange}
      >
        {servingLocations.length ?
          <Table
              columns={[
                {
                  Header: t('restaurant.servingLocations.actions'),
                  id: 'actions',
                  accessor: servingLocation => (
                    <Button onClick={this.handleActionSelect({key: 'edit', servingLocation})} plain>
                      {t('restaurant.servingLocations.action.edit')}
                    </Button>
                  ),
                  maxWidth: 100,
                  sortable: false,
                  resizable: false
                },
                {
                  Header: t('restaurant.servingLocations.name'),
                  accessor: 'name'
                }
              ]}
              data={servingLocations}
              select={{
                selectedItems,
                toggleSelect: this.toggleSelect,
                onHeaderClick: this.handleSelectHeaderClick
              }}
          />
        : ''}
      </WithActions>
    );
  }
}

export default compose(getServingLocationsByRestaurant)(
  connect(mapStateToProps, {addNotification})(ServingLocations)
);
