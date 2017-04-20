import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {hasIn} from 'lodash/fp';

import MenuItemForm from 'restaurant/menu-item/MenuItemForm.component';
import Button from 'mdl/Button.component';
import {getMenuItemsByRestaurant} from 'graphql/restaurant/restaurant.queries';
import MenuItem from 'restaurant/menu-item/MenuItem.component';
import FilterMenuItems from 'restaurant/menu/FilterMenuItems.component';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  filter: hasIn(['form', 'menuItemFilter', 'values'])(state) ?
    state.form.menuItemFilter.values : {}
});

class MenuItems extends React.Component {
  static PropTypes = {
    restaurant: React.PropTypes.object.isRequired,
    action: React.PropTypes.object,
    selectedItems: React.PropTypes.object,
    menuItem: React.PropTypes.shape({
      onClick: React.PropTypes.func
    }),
    plain: React.PropTypes.bool
  };
  static defaultProps = {
    selectedItems: new Set()
  };
  state = {
    action: null
  };
  handleActionChange = action => e => {
    e.preventDefault();
    this.setState({action});
  };
  resetAction = () => {
    this.setState({action: null});
  };
  handleMenuItemCreated = () => {
    this.setState({action: null});
    this.props.getMenuItemsByRestaurant.data.refetch();
  };
  render() {
    const {
      getMenuItemsByRestaurant: {menuItems} = {},
      restaurant,
      selectedItems,
      action: forceAction,
      filter,
      plain,
      t
    } = this.props;
    const action = forceAction || this.state.action || {};
    const returnButton = forceAction || action.hideReturn ? null : (
      <Button
          className="block"
          colored
          onClick={this.resetAction}
          type="button"
      >
        {t('return')}
      </Button>
    );
    return (
      <div>
        {
          action.hideSelection ? null :
            <div className={`container${plain ? '' : ' container--distinct'}`}>
              <div>
                <Button
                    colored
                    onClick={this.handleActionChange({
                      name: 'new',
                      hideItems: true,
                      hideSelection: true,
                      hideReturn: true
                    })}
                    type="button"
                >
                  {t('restaurant.menuItems.create')}
                </Button>
                <Button
                    colored
                    onClick={this.handleActionChange({
                      name: 'filter',
                      hideItems: false,
                      hideSelection: true
                    })}
                    type="button"
                >
                  {t('restaurant.menuItems.filter')}
                </Button>
              </div>
            </div>
        }
        {action.name ?
          <div className={`container${plain ? '' : ' container--distinct'}`}>
            {
              action.name === 'new' || action.name === 'edit' ?
                <div>
                  {returnButton}
                  <MenuItemForm
                      menuItem={action.name === 'edit' ? action.menuItem : null}
                      onCancel={this.resetAction}
                      onSubmit={this.handleMenuItemCreated}
                      restaurant={restaurant}
                  />
                </div>
              : action.name === 'filter' ?
                  <div>
                    {returnButton}
                    <FilterMenuItems />
                  </div>
              : null
            }
          </div> : null
        }
        {action.hideItems || !selectedItems instanceof Set ? null :
          <div className={`container${plain ? '' : ' container--distinct'}`}>
            {menuItems && menuItems.length ?
              menuItems
                .filter(menuItem =>
                  !filter.name || menuItem.name.indexOf(filter.name) > -1
                )
                .map((menuItem, index) => (
                  <MenuItem
                      actions={plain ? [] : [
                        {
                          text: t('edit'),
                          onClick: this.handleActionChange({
                            name: 'edit',
                            hideItems: true,
                            hideSelection: true,
                            hideReturn: true,
                            menuItem
                          })
                        }
                      ]}
                      className={selectedItems.has(menuItem.id) ? 'container__item--selected' : null}
                      key={index}
                      menuItem={menuItem}
                      {...this.props.menuItem}
                  />
                )) : 'no menu items'
            }
          </div>
        }
      </div>
    );
  }
}

export default compose(
  getMenuItemsByRestaurant
)(connect(mapStateToProps, {})(MenuItems));
