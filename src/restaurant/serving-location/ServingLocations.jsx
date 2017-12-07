import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import Cookie from 'js-cookie';
import {size} from 'lodash/fp';
import {saveAs} from 'file-saver';
import {servingLocation} from 'walless-graphql';

import {addNotification} from 'notifications/notification.reducer';
import Table from 'components/Table';
import Button from 'components/Button';
import config from 'config';
import WithActions from 'components/WithActions';
import ServingLocationForm from
  'restaurant/serving-location/ServingLocationForm';
import loadable from 'decorators/loadable';

@loadable()
@translate()
class ServingLocations extends React.Component {
  static propTypes = {
    action: PropTypes.shape({
      name: PropTypes.string.isRequired,
      item: PropTypes.object
    }),
    servingLocations: PropTypes.arrayOf(PropTypes.object),
    getServingLocationsByRestaurant: PropTypes.shape({refetch: PropTypes.func}),
    restaurant: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
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
  filterItems = item => true;
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
  handleDownloadQR = () => async() => {
    this.setState({downloadingQR: true});
    const {restaurant, addNotification, t} = this.props;
    const response = await fetch(
      `${config.api.protocol}://${config.api.url}${config.api.port === 80 ? '' : `:${config.api.port}`}/${config.api.servingLocation.endpoint}/restaurant/${restaurant.id}/` +
      `?servingLocations=[${[...this.state.selectedItems].toString()}]`,
      {
        method: 'GET',
        headers: {authorization: Cookie.get('authorization')}
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
        label: t('restaurant.servingLocation.action.filter'),
        item: (
          <div />
        )
      },
      edit: {
        hide: true,
        hideReturn: true,
        hideContent: true,
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
        label: t('restaurant.servingLocation.action.create'),
        hideReturn: true,
        hideContent: true,
        item: (
          <ServingLocationForm
            onCancel={this.handleActionChange}
            onSubmit={this.handleServingLocationSubmit}
            restaurant={restaurant}
          />
        )
      },
      downloadQR: {
        label: t('restaurant.servingLocation.action.downloadQR'),
        onClick: this.handleDownloadQR(),
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
                Header: t('restaurant.servingLocation.actions'),
                id: 'actions',
                accessor: servingLocation => (
                  <Button onClick={this.handleActionSelect({key: 'edit', servingLocation})} plain>
                    {t('restaurant.servingLocation.action.edit')}
                  </Button>
                ),
                maxWidth: 100,
                sortable: false,
                resizable: false
              },
              {
                Header: t('restaurant.servingLocation.name'),
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

export default compose(
  connect(undefined, {addNotification}),
  servingLocation.getServingLocationsByRestaurant
)(ServingLocations);
