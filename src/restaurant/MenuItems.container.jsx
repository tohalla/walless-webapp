import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {hasIn} from 'lodash/fp';

import MenuItemForm from 'restaurant/MenuItemForm.container';
import Button from 'mdl/Button.component';
import {getMenuItems} from 'graphql/restaurant/menuItem.queries';
import MenuItem from 'restaurant/MenuItem.component';
import FilterMenuItems from 'restaurant/FilterMenuItems.component';
import Checkbox from 'mdl/Checkbox.component';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  filter: hasIn(['form', 'menuItemFilter', 'values'])(state) ?
    state.form.menuItemFilter.values : {}
});

class MenuItems extends React.Component {
  static PropTypes = {
    menuItems: React.PropTypes.arrayOf(React.PropTypes.object),
    restaurant: React.PropTypes.object.isRequired,
    action: React.PropTypes.string,
    allowActions: React.PropTypes.bool,
    selectable: React.PropTypes.bool,
    plain: React.PropTypes.bool
  };
  static defaultProps = {
    allowActions: true
  };
  state = {
    action: null
  };
  handleActionChange = e => {
    this.setState({action: e.target.id});
  }
  resetAction = () => {
    this.setState({action: null});
  }
  handleMenuItemCreated = () => {
    this.setState({action: null});
    this.props.data.refetch();
  }
  render() {
    const {
      allowActions,
      menuItems,
      restaurant,
      action: forceAction,
      filter,
      plain,
      selectable
    } = this.props;
    const action = forceAction || this.state.action;
    const returnButton = forceAction ? null : (
      <Button
          className="block"
          colored
          onClick={this.resetAction}
          type="button"
      >
        {'Return'}
      </Button>
    );
    return (
      <div>
        <div className={`container${plain ? '' : ' container--distinct'}`}>
          {
            action === 'new' ?
              <div>
                {returnButton}
                <MenuItemForm
                    onCancel={this.resetAction}
                    onSubmit={this.handleMenuItemCreated}
                    restaurant={restaurant}
                />
              </div>
            : action === 'filter' ?
              <div>
                {returnButton}
                <FilterMenuItems />
              </div>
            :
              <div>
                <Button
                    colored
                    id="new"
                    onClick={this.handleActionChange}
                    type="button"
                >
                  {'Create new item'}
                </Button>
                <Button
                    colored
                    id="filter"
                    onClick={this.handleActionChange}
                    type="button"
                >
                  {'Filter items'}
                </Button>
              </div>
          }
        </div>
        <div className={`container${plain ? '' : ' container--distinct'}`}>
          {menuItems && menuItems.length ?
            menuItems
              .filter(menuItem =>
                !filter.name || menuItem.name.indexOf(filter.name) > -1
              )
              .map((menuItem, index) =>
                selectable ?
                  <div className="container__item" key={index}>
                    <div className="container__item__actions">
                      <Checkbox id={`select-${menuItem.id}`} />
                    </div>
                    <MenuItem className="container__item__content" menuItem={menuItem} />
                  </div>
                : <MenuItem
                    allowActions={allowActions}
                    className="container__item__content"
                    key={index}
                    menuItem={menuItem}
                  />
              ) : 'no menu items'
          }
        </div>
      </div>
    );
  }
}

export default compose(
  getMenuItems
)(connect(mapStateToProps, {})(MenuItems));
