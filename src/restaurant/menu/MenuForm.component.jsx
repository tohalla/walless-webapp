import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {reduce, set, get, equals} from 'lodash/fp';

import {getActiveAccount} from 'graphql/account/account.queries';
import Input from 'components/Input.component';
import Button from 'components/Button.component';
import {
  createMenu,
  updateMenu,
  updateMenuItems,
  createMenuInformation,
  updateMenuInformation
} from 'graphql/restaurant/menu.mutations';
import {getMenu} from 'graphql/restaurant/menu.queries';
import MenuItems from 'restaurant/menu-item/MenuItems.component';
import Tabbed from 'components/Tabbed.component';

const mapStateToProps = state => ({
  languages: state.util.translation.languages,
  t: state.util.translation.t
});

class MenuForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    createMenu: PropTypes.func.isRequired,
    updateMenu: PropTypes.func.isRequired,
    restaurant: PropTypes.object.isRequired,
    menu: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ])
  };
  constructor(props) {
    super(props);
    this.resetForm(props, state => this.state = state);
  }
  componentWillReceiveProps(newProps) {
    if (
      typeof this.props.menu !== typeof newProps.menu ||
      !equals(this.props.getMenu)(newProps.getMenu)
    ) {
      // should reset inputs when menu information fetched with given id
      this.resetForm(newProps);
    }
  }
  resetForm = (props, updateState = this.setState) => {
    const {
      getMenu: {
        menu: {
          information,
          menuItems
        }
      } = {menu: typeof props.menu === 'object' && props.menu ? props.menu : {}}
    } = props;
    updateState({
      activeLanguage: 'en',
      manageMenuItems: false,
      information,
      menuItems: menuItems ? new Set(
        menuItems.map(item => item.id)
      ) : new Set()
    });
  }
  handleInputChange = path => event => {
    const {value} = event.target;
    this.setState(set(path)(value)(this.state));
  };
  handleSubmit = async event => {
    event.preventDefault();
    const {
      createMenu,
      updateMenu,
      restaurant,
      onSubmit,
      onError,
      createMenuInformation,
      updateMenuInformation,
      getActiveAccount: {account} = {},
      getMenu: {
        menu: originalMenu
      } = {menu: typeof this.props.menu === 'object' ? this.props.menu : {}},
      updateMenuItems
    } = this.props;
    const {
      activeLanguage, // eslint-disable-line
      information,
      manageMenuItems, // eslint-disable-line
      menuItems,
      ...menuOptions
    } = this.state;
    const finalMenu = Object.assign({}, menuOptions,
      originalMenu ? {id: originalMenu.id} : null,
      {
        restaurant: restaurant.id,
        createdBy: account.id
      }
    );
    try {
      const {data} = await (originalMenu && originalMenu.id ? updateMenu(finalMenu) : createMenu(finalMenu));
      const [mutation] = Object.keys(data);
      const {[mutation]: {menu: {id: menuId}}} = data;
      await Promise.all([
          updateMenuItems(menuId, menuItems)
        ].concat(
          Object.keys(information).map(key =>
            mutation !== 'createMenu' && get(['information', key])(originalMenu) ?
              updateMenuInformation(Object.assign({language: key, menu: menuId}, information[key]))
            : createMenuInformation(Object.assign({language: key, menu: menuId}, information[key]))
          )
        )
      );
      onSubmit();
    } catch (error) {
      if (typeof onError === 'function') {
       return onError(error);
      }
      throw new Error(error);
    };
  };
  handleToggle = e => {
    this.setState({[e.target.id]: !this.state[e.target.id]});
  };
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  };
  handleTabChange = tab => this.setState({activeLanguage: tab});
  handleMenuItemSelect = item => {
    const menuItems = new Set([...this.state.menuItems]);
    if (menuItems.has(item.id)) {
      menuItems.delete(item.id);
    } else {
      menuItems.add(item.id);
    }
    this.setState({menuItems});
  }
  render() {
    const {restaurant, t, languages} = this.props;
    const {
      manageMenuItems,
      menuItems,
      activeLanguage
    } = this.state;
    const tabs = reduce((prev, value) => Object.assign({}, prev, {
      [value.locale]: {
        label: value.name,
        render: () => (
          <div>
            <Input
                className="block"
                label={t('restaurant.menus.name')}
                onChange={this.handleInputChange(['information', value.locale, 'name'])}
                type="text"
                value={get(['information', value.locale, 'name'])(this.state) || ''}
            />
            <Input
                className="block"
                label={t('restaurant.menus.description')}
                onChange={this.handleInputChange(['information', value.locale, 'description'])}
                rows={3}
                type="text"
                value={get(['information', value.locale, 'description'])(this.state) || ''}
            />
          </div>
        )
      }
    }), {})(languages);
    return (
      <form onSubmit={this.handleSubmit}>
        <Tabbed
            onTabChange={this.handleTabChange}
            tab={activeLanguage}
            tabs={tabs}
        />
        <div className="container container--padded">
          {manageMenuItems ?
            <MenuItems
                action={{name: 'filter'}}
                actions={['filter']}
                forceDefaultAction
                menuItem={{onClick: this.handleMenuItemSelect}}
                plain
                restaurant={restaurant}
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
  getMenu,
  createMenuInformation,
  updateMenuInformation
)(connect(mapStateToProps, {})(MenuForm));
