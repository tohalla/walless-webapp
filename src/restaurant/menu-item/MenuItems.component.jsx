import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {hasIn} from 'lodash/fp';

import MenuItemForm from 'restaurant/menu-item/MenuItemForm.component';
import Button from 'mdl/Button.component';
import {getMenuItems} from 'graphql/restaurant/menuItem.queries';
import MenuItem from 'restaurant/menu-item/MenuItem.component';
import FilterMenuItems from 'restaurant/menu/FilterMenuItems.component';
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
    action: React.PropTypes.object,
    selectable: React.PropTypes.bool,
    plain: React.PropTypes.bool
  };
  state = {
    action: null
  };
  handleActionChange = action => e => {
    e.preventDefault();
    this.setState({action});
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
      menuItems,
      restaurant,
      action: forceAction,
      filter,
      plain,
      selectable,
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
                  {'Create new item'}
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
                  {'Filter items'}
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
        {action.hideItems ? null :
          <div className={`container${plain ? '' : ' container--distinct'}`}>
            {menuItems && menuItems.length ?
              menuItems
                .filter(menuItem =>
                  !filter.name || menuItem.name.indexOf(filter.name) > -1
                )
                .map((menuItem, index) => {
                  const menuItemElement = (
                    <MenuItem
                        actions={[
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
                        className="container__item__content"
                        key={index}
                        menuItem={menuItem}
                    />
                  );
                  return selectable ?
                    <div className="container__item" key={index}>
                      <div className="container__item__actions">
                        <Checkbox id={`select-${menuItem.id}`} />
                      </div>
                      {menuItemElement}
                    </div>
                  : menuItemElement;
                }
                ) : 'no menu items'
            }
          </div>
        }
      </div>
    );
  }
}

export default compose(
  getMenuItems
)(connect(mapStateToProps, {})(MenuItems));
