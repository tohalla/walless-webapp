import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';

import Input from 'mdl/Input.component';
import Button from 'mdl/Button.component';
import {
  createMenuItem,
  updateMenuItem
} from 'graphql/restaurant/menuItem.mutations';
import {getMenuItem} from 'graphql/restaurant/menuItem.queries';
import {getActiveAccount} from 'graphql/account.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

class MenuItemForm extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    createMenuItem: React.PropTypes.func.isRequired,
    updateMenuItem: React.PropTypes.func.isRequired,
    restaurant: React.PropTypes.object.isRequired,
    me: React.PropTypes.object.isRequired,
    menuItem: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.number
    ])
  };
  constructor(props) {
    super(props);
    const {menuItem} = props;
    this.state = {
      name: menuItem.name || '',
      description: menuItem.description || '',
      type: menuItem.type || null,
      category: menuItem.category || null
    };
  }
  componentWillReceiveProps(newProps) {
    if (typeof this.props.menuItem !== typeof newProps.menuItem) {
      // should reset inputs when menu information fetched with given id
      const {name, description, type, category} = newProps;
      this.setState({
        name,
        description,
        type,
        category
      });
    }
  }
  handleInputChange = e => {
    const {id, value} = e.target;
    this.setState({[id]: value});
  }
  handleSubmit = e => {
    e.preventDefault();
    const {
      createMenuItem,
      updateMenuItem,
      restaurant,
      onSubmit,
      me,
      menuItem
    } = this.props;
    const finalMenuItem = Object.assign({}, this.state, {
      id: menuItem ? menuItem.id : null,
      restaurant: restaurant.id,
      createdBy: me.id
    });
    (menuItem && menuItem.id ?
      updateMenuItem(finalMenuItem) : createMenuItem(finalMenuItem)
    )
      .then(() => onSubmit());
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
  createMenuItem,
  updateMenuItem,
  getMenuItem,
  getActiveAccount
)(connect(mapStateToProps, {})(MenuItemForm));
