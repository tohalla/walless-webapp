import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {get} from 'lodash/fp';

import MenuItemForm from 'restaurant/menu-item/MenuItemForm.component';
import {getMenuItemsByRestaurant} from 'graphql/restaurant/menuItem.queries';
import {deleteMenuItem} from 'graphql/restaurant/menuItem.mutations';
import ConfirmationModal from 'components/ConfirmationModal.component';
import Table from 'components/Table.component';
import Button from 'components/Button.component';
import WithActions from 'components/WithActions.component';
import loadable from 'decorators/loadable';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  language: state.util.translation.language
});

@loadable()
@Radium
class MenuItems extends React.Component {
  static PropTypes = {
    restaurant: PropTypes.object.isRequired,
    action: PropTypes.shape({
      name: PropTypes.string.isRequired,
      item: PropTypes.object
    }),
    actions: PropTypes.arrayOf(PropTypes.string),
    select: PropTypes.shape({
      toggleSelect: PropTypes.func.isRequired,
      selectedItems: PropTypes.instanceOf(Set).isRequired,
      onHeaderClick: PropTypes.func
    }),
    menuItems: PropTypes.arrayOf(PropTypes.object),
    forceDefaultAction: PropTypes.bool
  };
  static defaultProps = {
    actions: ['filter', 'edit', 'new'],
    selectedItems: new Set(),
    forceDefaultAction: false
  };
  constructor(props) {
    super(props);
    this.state = {
      action: props.action
    };
  }
  handleActionChange = action => this.setState({action});
  handleActionSelect = action => () => this.handleActionChange(action);
  handleDelete = item => () => this.setState({
    deleteModal: item ? ({
      handleDelete: async () => {
        this.setState({deleteModal: undefined});
        await this.props.deleteMenuItem(item);
        await this.props.getMenuItemsByRestaurant.refetch();
      },
      item
    }) : undefined
  })
  handleMenuItemSubmit = () => {
    this.setState({action: null});
    this.props.getMenuItemsByRestaurant.refetch();
  };
  filterItems = item => true;
  render() {
    const {
      menuItems,
      restaurant,
      language,
      t,
      actions,
      select,
      ...props
    } = this.props;
    const {action, deleteModal} = this.state;
    const defaultActions = {
      filter: {
        label: t('restaurant.menuItem.action.filter'),
        item: (
          <div />
        )
      },
      edit: {
        hide: true,
        hideReturn: true,
        hideItems: true,
        item: (
          <MenuItemForm
              menuItem={action ? action.menuItem : undefined}
              onCancel={this.handleActionChange}
              onSubmit={this.handleMenuItemSubmit}
              restaurant={restaurant}
          />
        )
      },
      new: {
        label: t('restaurant.menuItem.action.create'),
        hideReturn: true,
        hideItems: true,
        item: (
          <MenuItemForm
              onCancel={this.handleActionChange}
              onSubmit={this.handleMenuItemSubmit}
              restaurant={restaurant}
          />
        )
      }
    };
    return (
      <WithActions
          {...props}
          action={action ? action.key : undefined}
          actions={actions &&
            Object.keys(defaultActions).reduce((prev, key) =>
              actions.indexOf(key) === -1 ?
                prev : Object.assign({}, prev, {[key]: defaultActions[key]})
            , {})
          }
          onActionChange={this.handleActionChange}
      >
        {typeof get('handleDelete')(deleteModal) === 'function' ? (
          <ConfirmationModal
              accent
              confirmText={t('delete')}
              message={
                t('confirmDelete', {
                  name: get(['i18n', language, 'name'])(deleteModal.item)
                })
              }
              onCancel={this.handleDelete()}
              onConfirm={deleteModal.handleDelete}
          />
        ) : null}
        <Table
            columns={[
              {
                Header: t('restaurant.menuItem.images'),
                id: 'img',
                accessor: menuItem => menuItem.images.length ? (
                  <img src={menuItem.images[0].uri} style={styles.image} />
                ) : null,
                style: {padding: 0},
                width: 120
              },
              {
                Header: t('restaurant.menuItem.actions'),
                id: 'actions',
                accessor: menuItem => (
                  <div style={styles.actions}>
                    <Button onClick={this.handleActionSelect({key: 'edit', menuItem})} plain>
                      {t('restaurant.menuItem.action.edit')}
                    </Button>
                    <Button onClick={this.handleDelete(menuItem)} plain>
                      {t('restaurant.menuItem.action.delete')}
                    </Button>
                  </div>
                ),
                maxWidth: 140,
                resizable: false,
                sortable: false,
                style: {padding: 0}
              },
              {
                Header: t('restaurant.menuItem.name'),
                accessor: menuItem => get(['i18n', language, 'name'])(menuItem),
                id: 'name'
              },
              {
                Header: t('restaurant.menuItem.description'),
                accessor: menuItem => get(['i18n', language, 'description'])(menuItem),
                id: 'description'
              }
            ]}
            data={menuItems}
            select={select}
        />
      </WithActions>
    );
  }
}

export default compose(
  connect(mapStateToProps),
  getMenuItemsByRestaurant,
  deleteMenuItem
)(MenuItems);

const styles = {
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    height: 'auto',
    width: 'auto',
    overflow: 'hidden'
  },
  actions: {
    display: 'flex',
    flexDirection: 'row'
  }
};
