import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {reduce, set, get, equals} from 'lodash/fp';

import Form from 'components/Form.component';
import Button from 'components/Button.component';
import {getActiveAccount} from 'graphql/account/account.queries';
import Input from 'components/Input.component';
import {
  createMenu,
  updateMenu,
  updateMenuItems,
  createMenuI18n,
  updateMenuI18n
} from 'graphql/restaurant/menu.mutations';
import {getMenu} from 'graphql/restaurant/menu.queries';
import MenuItems from 'restaurant/menu-item/MenuItems.component';
import Tabbed from 'components/Tabbed.component';

const TextArea = props => <textarea {...props} />;

const mapStateToProps = state => ({
  languages: state.util.translation.languages,
  t: state.util.translation.t
});

@Radium
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
      } = typeof props.menu === 'object' && props.menu ? props.menu : {}
    } = props;
    updateState({
      activeLanguage: 'en',
      manageMenuItems: false,
      i18n,
      menuItems: menuItems ? new Set(
        menuItems.map(item => item.id)
      ) : new Set()
    });
  };
  handleInputChange = path => event =>
    this.setState(set(path)(event.target.value)(this.state));
  handleSubmit = async event => {
    event.preventDefault();
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
        content: (
          <div>
            <Input
                label={t('restaurant.menu.name')}
                onChange={this.handleInputChange(['i18n', value.locale, 'name'])}
                value={get(['i18n', value.locale, 'name'])(this.state) || ''}
            />
            <Input
                Input={TextArea}
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
      <Form onCancel={this.handleCancel} onSubmit={this.handleSubmit}>
        <Tabbed
            onTabChange={this.handleTabChange}
            tab={activeLanguage}
            tabs={tabs}
        />
        {manageMenuItems ? (
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
         ) : (
          <div>
            <Button onClick={this.handleToggle('manageMenuItems')}>
              {t('restaurant.menu.manageMenuItems')}
            </Button>
          </div>
        )}
      </Form>
    );
  }
}

export default compose(
  connect(mapStateToProps, {}),
  createMenu,
  updateMenu,
  updateMenuItems,
  getActiveAccount,
  getMenu,
  createMenuI18n,
  updateMenuI18n
)(MenuForm);
