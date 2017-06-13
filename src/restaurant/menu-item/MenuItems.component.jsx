import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {hasIn} from 'lodash/fp';
import PropTypes from 'prop-types';

import MenuItemForm from 'restaurant/menu-item/MenuItemForm.component';
import {getMenuItemsByRestaurant} from 'graphql/restaurant/restaurant.queries';
import MenuItem from 'restaurant/menu-item/MenuItem.component';
import FilterMenuItems from 'restaurant/menu/FilterMenuItems.component';
import ListItems from 'util/ListItems.component';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  filter: hasIn(['form', 'menuItemFilter', 'values'])(state) ?
    state.form.menuItemFilter.values : {}
});

class MenuItems extends React.Component {
  static PropTypes = {
    restaurant: PropTypes.object.isRequired,
    action: PropTypes.shape({
      name: PropTypes.string.isRequired,
      item: PropTypes.object
    }),
    selectedItems: PropTypes.instanceOf(Set),
    menuItem: PropTypes.shape({
      onClick: PropTypes.func
    }),
    plain: PropTypes.bool
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
  renderMenuItem = (menuItem, props) => (
    <MenuItem
        actions={this.props.plain ? [] : [
          {
            label: this.props.t('edit'),
            onClick: this.handleActionChange({name: 'edit', menuItem})
          }
        ]}
        className={this.props.selectedItems.has(menuItem.id) ?
          'container__row selected' : null
        }
        menuItem={menuItem}
        {...this.props.menuItem}
        {...props}
    />
  );
  handleMenuItemSubmit = () => {
    this.setState({action: null});
    this.props.getMenuItemsByRestaurant.data.refetch();
  };
  filterItems = item =>
    !this.props.filter.name || item.name.indexOf(this.props.filter.name) > -1;
  render() {
    const {
      getMenuItemsByRestaurant: {menuItems} = {},
      restaurant,
      selectedItems,
      plain,
      t
    } = this.props;
    const {action} = this.state;
    const actions = {
      filter: {
        label: t('restaurant.menuItems.filter'),
        render: () => (
          <FilterMenuItems />
        )
      },
      edit: {
        hide: true,
        hideReturn: true,
        hideItems: true,
        render: () => (
          <MenuItemForm
              menuItem={action ? action.menuItem : null}
              onCancel={this.handleActionChange()}
              onSubmit={this.handleMenuItemSubmit}
              restaurant={restaurant}
          />
        )
      },
      new: {
        label: t('restaurant.menuItems.create'),
        hideReturn: true,
        hideItems: true,
        render: () => (
          <MenuItemForm
              onCancel={this.handleActionChange()}
              onSubmit={this.handleMenuItemSubmit}
              restaurant={restaurant}
          />
        )
      }
    };
    return (
      <ListItems
          action={action ? action.name : null}
          actions={actions}
          containerClass={plain ? 'container' : 'container container--distinct'}
          filterItems={this.filterItems}
          items={menuItems}
          onActionChange={this.handleActionChange}
          renderItem={this.renderMenuItem}
          selectedItems={selectedItems}
      />
    );
  }
}

export default compose(
  getMenuItemsByRestaurant
)(connect(mapStateToProps, {})(MenuItems));
