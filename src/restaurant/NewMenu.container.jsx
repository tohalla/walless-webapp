import React from 'react';
import {compose} from 'react-apollo';

import Input from 'mdl/Input.component';
import Button from 'mdl/Button.component';
import {createMenu} from 'graphql/restaurant/menu.mutations';
import {getActiveAccount} from 'graphql/account.queries';

class NewMenu extends React.Component {
  static contextTypes = {
    t: React.PropTypes.func
  };
  static propTypes = {
    onMenuCreated: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    createMenu: React.PropTypes.func.isRequired
  };
  state = {
    name: '',
    description: ''
  }
  handleInputChange = e => {
    const {id, value} = e.target;
    this.setState({[id]: value});
  }
  handleSubmit = e => {
    e.preventDefault();
    const {createMenu, me, onMenuCreated} = this.props;
    createMenu(Object.assign(
      {},
      this.state,
      {createdBy: me.id}
    ))
    .then(() => onMenuCreated());
  }
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  }
  render() {
    const {t} = this.context;
    const {description, name} = this.state;
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
)(NewMenu);
