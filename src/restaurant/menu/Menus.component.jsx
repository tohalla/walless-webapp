import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import {get} from 'lodash/fp';

import MenuForm from 'restaurant/menu/MenuForm.component';
import {getMenusByRestaurant} from 'graphql/restaurant/menu.queries';
import {deleteMenu} from 'graphql/restaurant/menu.mutations';
import Button from 'components/Button.component';
import ConfirmationModal from 'components/ConfirmationModal.component';
import Table from 'components/Table.component';
import WithActions from 'components/WithActions.component';
import loadable from 'decorators/loadable';

const mapStateToProps = state => ({
  language: state.util.translation.language,
  t: state.util.translation.t
});

@loadable()
@Radium
class Menus extends React.Component {
  static PropTypes = {
    restaurant: PropTypes.object.isRequired,
    action: PropTypes.shape({
      name: PropTypes.string.isRequired,
      item: PropTypes.object
    }),
    selectedItems: PropTypes.instanceOf(Set),
    menu: PropTypes.shape({
      onClick: PropTypes.func
    }),
    plain: PropTypes.bool
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
      handleDelete: async () => {
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
      language,
      t
    } = this.props;
    const {action, deleteModal} = this.state;
    const actions = {
      new: {
        label: t('restaurant.menu.action.create'),
        hideReturn: true,
        hideItems: true,
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
        hideItems: true,
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
  connect(mapStateToProps),
  getMenusByRestaurant,
  deleteMenu
)(Menus);

const styles = {
  actions: {
    display: 'flex',
    flexDirection: 'row'
  }
};
