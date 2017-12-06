import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {reduce, set, get, equals} from 'lodash/fp';
import {account, menu, misc} from 'walless-graphql';

import Input from 'components/Input.component';
import Expandable from 'components/Expandable.component';
import Form from 'components/Form.component';
import MenuItems from 'restaurant/menu-item/MenuItems.component';
import Tabbed from 'components/Tabbed.component';

@translate()
@Radium
class MenuForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    createMenu: PropTypes.func.isRequired,
    updateMenu: PropTypes.func.isRequired,
    restaurant: PropTypes.object.isRequired,
    getMenu: PropTypes.shape({refetch: PropTypes.func}),
    i18n: PropTypes.shape({languages: PropTypes.arrayOf(PropTypes.string)}),
    menu: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    t: PropTypes.func.isRequired,
    languages: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      locale: PropTypes.string
    }))
  };
  constructor(props) {
    super(props);
    this.resetForm(props, state => this.state = state); // eslint-disable-line
  }
  componentWillReceiveProps(newProps) {
    if (
      typeof this.props.menu !== typeof newProps.menu ||
      !equals(this.props.getMenu)(newProps.getMenu)
    ) {
      this.resetForm(newProps);
    }
  }
  resetForm = (props, updateState = state => this.setState(state)) => {
    const {
      menu: {
        i18n,
        menuItems
      } = typeof props.menu === 'object' && props.menu ? props.menu : {},
      i18n: {languages: [language]}
    } = props;
    updateState({
      activeLanguage: language,
      manageMenuItems: false,
      loading: false,
      i18n,
      menuItems: menuItems ? new Set(
        menuItems.map(item => item.id)
      ) : new Set()
    });
  };
  handleInputChange = path => event =>
    this.setState(set(path)(event.target.value)(this.state));
  handleSubmit = () => async event => {
    event.preventDefault();
    this.setState({loading: true});
    const {
      createMenu,
      updateMenu,
      restaurant,
      onSubmit,
      onError,
      createMenuI18n,
      updateMenuI18n,
      account,
      menu: originalMenu = typeof this.props.menu === 'object' ? this.props.menu : {},
      updateMenuItems
    } = this.props;
    const {i18n, menuItems} = this.state;
    const finalMenu = Object.assign({},
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
        Object.keys(i18n).map(key =>
          mutation !== 'createMenu' && get(['i18n', key])(originalMenu) ?
            updateMenuI18n(Object.assign({language: key, menu: menuId}, i18n[key]))
            : createMenuI18n(Object.assign({language: key, menu: menuId}, i18n[key]))
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
  handleToggle = key => () => this.setState({[key]: !this.state[key]});
  handleCancel = () => this.props.onCancel();
  handleTabChange = tab => this.setState({activeLanguage: tab});
  handleMenuItemSelect = item => {
    const menuItems = new Set([...this.state.menuItems]);
    if (menuItems.has(item.id)) {
      menuItems.delete(item.id);
    } else {
      menuItems.add(item.id);
    }
    this.setState({menuItems});
  };
  render() {
    const {restaurant, t, languages} = this.props;
    const {
      menuItems,
      activeLanguage,
      loading
    } = this.state;
    const tabs = reduce((prev, value) => Object.assign({}, prev, {
      [value.locale]: {
        label: value.name,
        content: (
          <div>
            <Input
              label={t('restaurant.menu.name')}
              onChange={this.handleInputChange(['i18n', value.locale, 'name'])}
              value={get(['i18n', value.locale, 'name'])(this.state) || ''}
            />
            <Input
              Input={'textarea'}
              label={t('restaurant.menu.description')}
              onChange={this.handleInputChange(['i18n', value.locale, 'description'])}
              rows={3}
              value={get(['i18n', value.locale, 'description'])(this.state) || ''}
            />
          </div>
        )
      }
    }), {})(languages);
    return (
      <Form
        loading={loading}
        onCancel={this.handleCancel}
        onSubmit={this.handleSubmit()}
      >
        <Tabbed
          onTabChange={this.handleTabChange}
          tab={activeLanguage}
          tabs={tabs}
        />
        <Expandable title={t('restaurant.menu.manageMenuItems')}>
          <MenuItems
            action={{name: 'filter'}}
            actions={['filter']}
            forceDefaultAction
            plain
            restaurant={restaurant}
            select={{
              toggleSelect: this.handleMenuItemSelect,
              selectedItems: menuItems
            }}
          />
        </Expandable>
      </Form>
    );
  }
}

export default compose(
  menu.createMenu,
  menu.updateMenu,
  menu.updateMenuItems,
  account.getActiveAccount,
  menu.getMenu,
  menu.createMenuI18n,
  menu.updateMenuI18n,
  misc.getLanguages
)(MenuForm);
