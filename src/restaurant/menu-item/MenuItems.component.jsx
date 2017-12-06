import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {get} from 'lodash/fp';
import {menuItem} from 'walless-graphql';

import MenuItemForm from 'restaurant/menu-item/MenuItemForm.component';
import ConfirmationModal from 'components/ConfirmationModal.component';
import Table from 'components/Table.component';
import Button from 'components/Button.component';
import WithActions from 'components/WithActions.component';
import loadable from 'decorators/loadable';

@loadable()
@translate()
@Radium
class MenuItems extends React.Component {
  static propTypes = {
    restaurant: PropTypes.object.isRequired,
    deleteMenuItem: PropTypes.func.isRequired,
    getMenuItemsByRestaurant: PropTypes.shape({refetch: PropTypes.func}),
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
    forceDefaultAction: PropTypes.bool,
    i18n: PropTypes.shape({languages: PropTypes.arrayOf(PropTypes.string)}),
    t: PropTypes.func.isRequired
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
      handleDelete: async() => {
        this.setState({deleteModal: undefined});
        await this.props.deleteMenuItem(item);
        await this.props.getMenuItemsByRestaurant.refetch();
      },
      item
    }) : undefined
  });
  handleMenuItemSubmit = () => {
    this.setState({action: null});
    this.props.getMenuItemsByRestaurant.refetch();
  };
  filterItems = item => true;
  render() {
    const {
      menuItems,
      restaurant,
      i18n: {languages: [language]},
      t,
      actions,
      select,
      ...props
    } = this.props;
    const {action, deleteModal} = this.state;
    const defaultActions = {
      filter: {
        label: t('restaurant.item.action.filter'),
        item: (
          <div />
        )
      },
      edit: {
        hide: true,
        hideReturn: true,
        hideContent: true,
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
        label: t('restaurant.item.action.create'),
        hideReturn: true,
        hideContent: true,
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
        hideContent={!(menuItems && menuItems.length)}
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
              Header: t('restaurant.item.images'),
              id: 'img',
              accessor: menuItem => menuItem.images.length ? (
                <img src={menuItem.images[0].uri} style={styles.image} />
              ) : null,
              style: {padding: 0},
              width: 120
            },
            {
              Header: t('restaurant.item.actions'),
              id: 'actions',
              accessor: menuItem => (
                <div style={styles.actions}>
                  <Button onClick={this.handleActionSelect({key: 'edit', menuItem})} plain>
                    {t('restaurant.item.action.edit')}
                  </Button>
                  <Button onClick={this.handleDelete(menuItem)} plain>
                    {t('restaurant.item.action.delete')}
                  </Button>
                </div>
              ),
              maxWidth: 140,
              resizable: false,
              sortable: false,
              style: {padding: 0}
            },
            {
              Header: t('restaurant.item.name'),
              accessor: menuItem => get(['i18n', language, 'name'])(menuItem),
              id: 'name'
            },
            {
              Header: t('restaurant.item.description'),
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
  menuItem.getMenuItemsByRestaurant,
  menuItem.deleteMenuItem
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
