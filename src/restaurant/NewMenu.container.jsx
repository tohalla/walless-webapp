import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';

import {getActiveAccount} from 'graphql/account.queries';
import Input from 'mdl/Input.component';
import Button from 'mdl/Button.component';
import {createMenu} from 'graphql/restaurant/menu.mutations';
import MenuItems from 'restaurant/MenuItems.container';

const mapStateToProps = state => ({t: state.util.translation.t});

class NewMenu extends React.Component {
  static propTypes = {
    onCreated: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    createMenu: React.PropTypes.func.isRequired,
    restaurant: React.PropTypes.object.isRequired
  };
  state = {
    name: '',
    description: '',
    manageMenuItems: false
  }
  handleInputChange = e => {
    const {id, value} = e.target;
    this.setState({[id]: value});
  }
  handleSubmit = e => {
    e.preventDefault();
    const {createMenu, restaurant, onCreated, me} = this.props;
    const {manageMenuItems, ...menu} = this.state; // eslint-disable-line
    createMenu(Object.assign(
      {},
      menu,
      {
        restaurant: restaurant.id,
        createdBy: me.id
      }
    ))
    .then(() => onCreated());
  }
  handleToggle = e => {
    this.setState({[e.target.id]: !this.state[e.target.id]});
  }
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  }
  render() {
    const {restaurant, t} = this.props;
    const {description, name, manageMenuItems} = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
            className="block"
            id="name"
            label={t('restaurant.menus.creation.name')}
            onChange={this.handleInputChange}
            type="text"
            value={name}
        />
        <Input
            className="block"
            id="description"
            label={t('restaurant.menus.creation.description')}
            onChange={this.handleInputChange}
            rows={3}
            type="text"
            value={description}
        />
        <div className="container">
          {manageMenuItems ?
            <MenuItems
                action="filter"
                allowActions={false}
                plain
                restaurant={restaurant}
                selectable
            />
            :
            <Button colored id="manageMenuItems" onClick={this.handleToggle}>
              {t('restaurant.menus.manageMenuItems')}
            </Button>
          }
        </div>
        <div>
          <Button colored onClick={this.handleSubmit} raised type="submit">
            {t('restaurant.menus.creation.create')}
          </Button>
          <Button accent onClick={this.handleCancel} raised type="reset">
            {t('restaurant.menus.creation.cancel')}
          </Button>
        </div>
      </form>
    );
  }
}

export default compose(
  createMenu,
  getActiveAccount
)(connect(mapStateToProps, {})(NewMenu));
