import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {hasIn} from 'lodash/fp';

import {getActiveAccount} from 'graphql/account/account.queries';
import Input from 'mdl/Input.component';
import Button from 'mdl/Button.component';
import {
  createMenu,
  updateMenu,
  updateMenuItems
} from 'graphql/restaurant/menu.mutations';
import {getMenu} from 'graphql/restaurant/menu.queries';
import MenuItems from 'restaurant/menu-item/MenuItems.component';

const mapStateToProps = state => ({t: state.util.translation.t});

class MenuForm extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    createMenu: React.PropTypes.func.isRequired,
    updateMenu: React.PropTypes.func.isRequired,
    restaurant: React.PropTypes.object.isRequired,
    menu: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.number
    ])
  };
  constructor(props) {
    super(props);
    const menu = props.menu || {};
    this.state = {
      name: menu.name || '',
      description: menu.description || '',
      manageMenuItems: false,
      menuItems: hasIn(['menuMenuItemsByMenu', 'edges'])(menu) ? new Set(
        menu.menuMenuItemsByMenu.edges.map(edge => edge.node.menuItemByMenuItem.id)
      ) : new Set()
    };
  }
  componentWillReceiveProps(newProps) {
    if (typeof this.props.menu !== typeof newProps.menu) {
      // should reset inputs when menu information fetched with given id
      const {name, description, menuMenuItemsByMenu} = newProps.menu;
      this.setState({
        name,
        description,
        menuItems:
          menuMenuItemsByMenu &&
          hasIn(['menuMenuItemsByMenu'])(menuMenuItemsByMenu) ? new Set(
            menuMenuItemsByMenu.edges.map(edge => edge.node.menuItemByMenuItem.id)
        ) : new Set()
      });
    }
  }
  handleInputChange = e => {
    const {id, value} = e.target;
    this.setState({[id]: value});
  };
  handleSubmit = e => {
    e.preventDefault();
    const {
      createMenu,
      updateMenu,
      restaurant,
      onSubmit,
      me,
      menu,
      updateMenuItems
    } = this.props;
    const {manageMenuItems, menuItems, ...menuOptions} = this.state; // eslint-disable-line
    const finalMenu = Object.assign({}, menuOptions,
      menu ? {id: menu.id} : null,
      {
        restaurant: restaurant.id,
        createdBy: me.id
      }
    );
    (menu && menu.id ? updateMenu(finalMenu) : createMenu(finalMenu))
      .then(({data}) => updateMenuItems(data[Object.keys(data)[0]].menu.id, menuItems))
      .then(() => onSubmit());
  };
  handleToggle = e => {
    this.setState({[e.target.id]: !this.state[e.target.id]});
  };
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  };
  handleMenuItemSelect = item => {
    const menuItems = new Set([...this.state.menuItems]);
    if (menuItems.has(item)) {
      menuItems.delete(item);
    } else {
      menuItems.add(item);
    }
    this.setState({menuItems});
  }
  render() {
    const {restaurant, t} = this.props;
    const {description, name, manageMenuItems, menuItems} = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
            className="block"
            id="name"
            label={t('restaurant.menus.name')}
            onChange={this.handleInputChange}
            type="text"
            value={name}
        />
        <Input
            className="block"
            id="description"
            label={t('restaurant.menus.description')}
            onChange={this.handleInputChange}
            rows={3}
            type="text"
            value={description}
        />
        <div className="container">
          {manageMenuItems ?
            <MenuItems
                action={{
                  name: 'filter',
                  hideItems: false,
                  hideSelection: true,
                  hideReturn: true
                }}
                onToggle={this.handleMenuItemSelect}
                plain
                restaurant={restaurant}
                selectable
                selectedItems={menuItems}
            />
            :
            <Button colored id="manageMenuItems" onClick={this.handleToggle}>
              {t('restaurant.menus.manageMenuItems')}
            </Button>
          }
        </div>
        <div>
          <Button colored onClick={this.handleSubmit} raised type="submit">
            {t('submit')}
          </Button>
          <Button accent onClick={this.handleCancel} raised type="reset">
            {t('cancel')}
          </Button>
        </div>
      </form>
    );
  }
}

export default compose(
  createMenu,
  updateMenu,
  updateMenuItems,
  getActiveAccount,
  getMenu
)(connect(mapStateToProps, {})(MenuForm));
