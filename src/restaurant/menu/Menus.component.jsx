import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';

import MenuForm from 'restaurant/menu/MenuForm.component';
import {getMenusByRestaurant} from 'graphql/restaurant/restaurant.queries';
import Menu from 'restaurant/menu/Menu.component';
import ListItems from 'components/ListItems.component';
import {isLoading} from 'util/shouldComponentUpdate';

const mapStateToProps = state => ({t: state.util.translation.t});

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
  shouldComponentUpdate = newProps => !isLoading(newProps);
  handleActionChange = action => event => {
    this.setState({action});
  };
  handleMenuSubmit = () => {
    this.setState({action: null});
    this.props.getMenusByRestaurant.refetch();
  };
  renderMenu = (menu, props) => (
    <Menu
        actions={[
          {
            label: this.props.t('edit'),
            onClick: this.handleActionChange({
              key: 'edit',
              menu
            })
          }
        ]}
        menu={menu}
        {...props}
    />
  );
  render() {
    const {
      menus,
      restaurant,
      selectedItems,
      plain,
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
              onCancel={this.handleActionChange()}
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
              onCancel={this.handleActionChange()}
              onSubmit={this.handleMenuSubmit}
              restaurant={restaurant}
          />
        )
      }
    };
    return (
      <ListItems
          action={action ? action.key : null}
          actions={actions}
          containerClass={plain ? 'container' : 'container container--padded container--distinct'}
          items={menus}
          onActionChange={this.handleActionChange}
          renderItem={this.renderMenu}
          selectedItems={selectedItems}
      />
    );
  }
}

export default compose(
  getMenusByRestaurant
)(connect(mapStateToProps)(Menus));
