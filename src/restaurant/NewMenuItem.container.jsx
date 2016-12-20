import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';

import Input from 'mdl/Input.component';
import Button from 'mdl/Button.component';
import {createMenuItem} from 'graphql/restaurant/menuItem.mutations';
import {getActiveAccount} from 'graphql/account.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

class NewMenuItem extends React.Component {
  static propTypes = {
    onCreated: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    createMenu: React.PropTypes.func.isRequired,
    restaurant: React.PropTypes.object.isRequired,
    me: React.PropTypes.object.isRequired
  };
  state = {
    name: '',
    description: '',
    type: null,
    category: null
  }
  handleInputChange = e => {
    const {id, value} = e.target;
    this.setState({[id]: value});
  }
  handleSubmit = e => {
    e.preventDefault();
    const {createMenu, me, restaurant, onCreated} = this.props;
    createMenu(Object.assign(
      {},
      this.state,
      {
        restaurant: restaurant.id,
        createdBy: me.id
      }
    ))
    .then(() => onCreated());
  }
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  }
  render() {
    const {t} = this.props;
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
  createMenuItem,
  getActiveAccount
)(connect(mapStateToProps, {})(NewMenuItem));
