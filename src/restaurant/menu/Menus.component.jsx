import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import {get} from 'lodash/fp';

import MenuForm from 'restaurant/menu/MenuForm.component';
import {getMenusByRestaurant} from 'graphql/restaurant/menu.queries';
import Button from 'components/Button.component';
import Table from 'components/Table.component';
import WithActions from 'components/WithActions.component';
import loadable from 'decorators/loadable';

const mapStateToProps = state => ({
  language: state.util.translation.language,
  t: state.util.translation.t
});

@loadable()
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
      action: props.action
    };
  }
  handleActionChange = action => this.setState({action});
  handleActionSelect = action => () => this.handleActionChange(action);
  handleMenuSubmit = () => {
    this.setState({action: null});
    this.props.getMenusByRestaurant.refetch();
  };
  render() {
    const {
      menus,
      restaurant,
      language,
      t
    } = this.props;
    const {action} = this.state;
    const actions = {
      new: {
        label: t('restaurant.menus.action.create'),
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
              menu={action ? action.menu : null}
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
        {menus.length ?
          <Table
              columns={[
                {
                  Header: t('restaurant.menus.actions'),
                  id: 'actions',
                  accessor: menu => (
                    <Button onClick={this.handleActionSelect({key: 'edit', menu})} plain>
                      {t('restaurant.menus.action.edit')}
                    </Button>
                  ),
                  maxWidth: 100,
                  resizable: false,
                  sortable: false
                },
                {
                  Header: t('restaurant.menus.name'),
                  accessor: menu => get(['information', language, 'name'])(menu),
                  id: 'name'
                },
                {
                  Header: t('restaurant.menus.description'),
                  accessor: menu => get(['information', language, 'description'])(menu),
                  id: 'description'
                }
              ]}
              data={menus}
          />
        : ''}
      </WithActions>
    );
  }
}

export default compose(
  getMenusByRestaurant
)(connect(mapStateToProps)(Menus));
