import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {get} from 'lodash/fp';
import {menu} from 'walless-graphql';

import MenuForm from 'restaurant/menu/MenuForm';
import Button from 'components/Button';
import ConfirmationModal from 'components/ConfirmationModal';
import Table from 'components/Table';
import WithActions from 'components/WithActions';
import loadable from 'decorators/loadable';

@loadable()
@translate()
class Menus extends React.Component {
  static propTypes = {
    restaurant: PropTypes.object.isRequired,
    action: PropTypes.shape({
      name: PropTypes.string.isRequired,
      item: PropTypes.object
    }),
    getMenusByRestaurant: PropTypes.shape({refetch: PropTypes.func}),
    deleteMenu: PropTypes.func,
    i18n: PropTypes.shape({languages: PropTypes.arrayOf(PropTypes.string)}),
    menus: PropTypes.arrayOf(PropTypes.object),
    t: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      action: props.action,
      deleteModal: undefined
    };
  }
  handleActionChange = action => this.setState({action});
  handleActionSelect = action => () => this.handleActionChange(action);
  handleDelete = item => () => this.setState({
    deleteModal: item ? ({
      handleDelete: async() => {
        this.setState({deleteModal: undefined});
        await this.props.deleteMenu(item);
        await this.props.getMenusByRestaurant.refetch();
      },
      item
    }) : undefined
  });
  handleMenuSubmit = () => {
    this.setState({action: undefined});
    this.props.getMenusByRestaurant.refetch();
  };
  render() {
    const {
      menus,
      restaurant,
      i18n: {languages: [language]},
      t
    } = this.props;
    const {action, deleteModal} = this.state;
    const actions = {
      new: {
        label: t('restaurant.menu.action.create'),
        hideReturn: true,
        hideContent: true,
        item: (
          <MenuForm
            onCancel={this.handleActionChange}
            onSubmit={this.handleMenuSubmit}
            restaurant={restaurant}
          />
        )
      },
      edit: {
        hide: true,
        hideReturn: true,
        hideContent: true,
        item: (
          <MenuForm
            menu={action ? action.menu : undefined}
            onCancel={this.handleActionChange}
            onSubmit={this.handleMenuSubmit}
            restaurant={restaurant}
          />
        )
      }
    };
    return (
      <WithActions
        action={action ? action.key : undefined}
        actions={actions}
        hideContent={!(menus && menus.length)}
        onActionChange={this.handleActionChange}
      >
        {typeof get('handleDelete')(deleteModal) === 'function' && (
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
        )}
        <Table
          columns={[
            {
              Header: t('restaurant.menu.actions'),
              id: 'actions',
              accessor: menu => (
                <div style={styles.actions}>
                  <Button onClick={this.handleActionSelect({key: 'edit', menu})} plain>
                    {t('restaurant.menu.action.edit')}
                  </Button>
                  <Button onClick={this.handleDelete(menu)} plain>
                    {t('restaurant.menu.action.delete')}
                  </Button>
                </div>
              ),
              maxWidth: 140,
              resizable: false,
              sortable: false,
              style: {padding: 0}
            },
            {
              Header: t('restaurant.menu.name'),
              accessor: menu => get(['i18n', language, 'name'])(menu),
              id: 'name'
            },
            {
              Header: t('restaurant.menu.description'),
              accessor: menu => get(['i18n', language, 'description'])(menu),
              id: 'description'
            }
          ]}
          data={menus}
        />
      </WithActions>
    );
  }
}

export default compose(
  menu.getMenusByRestaurant,
  menu.deleteMenu
)(Menus);

const styles = {
  actions: {
    display: 'flex',
    flexDirection: 'row'
  }
};
