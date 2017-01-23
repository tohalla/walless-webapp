import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';

import {getActiveAccount} from 'graphql/account.queries';
import Input from 'mdl/Input.component';
import Button from 'mdl/Button.component';
import {
  createRestaurant,
  updateRestaurant
  } from 'graphql/restaurant/restaurant.mutations';
import {getRestaurant} from 'graphql/restaurant/restaurant.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

class RestaurantForm extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
    createRestaurant: React.PropTypes.func.isRequired,
    updateRestaurant: React.PropTypes.func.isRequired,
    restaurant: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.number
    ])
  };
  constructor(props) {
    super(props);
    const restaurant = props.restaurant || {};
    this.state = {
      name: restaurant.name || '',
      description: restaurant.description || ''
    };
  }
  componentWillReceiveProps(newProps) {
    if (typeof this.props.restaurant !== typeof newProps.restaurant) {
      // should reset inputs when restaurant information fetched with given id
      const {name, description} = newProps;
      this.setState({
        name,
        description
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
      createRestaurant,
      updateRestaurant,
      onSubmit,
      me,
      restaurant
    } = this.props;
    const finalRestaurant = Object.assign({}, this.state,
      restaurant ? {id: restaurant.id} : null,
      {
        restaurant: restaurant,
        createdBy: me.id
      }
    );
    (restaurant && restaurant.id ?
      updateRestaurant(finalRestaurant) : createRestaurant(finalRestaurant)
    )
      .then(() => onSubmit());
  }
  handleToggle = e => {
    this.setState({[e.target.id]: !this.state[e.target.id]});
  }
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  }
  render() {
    const {t, onCancel} = this.props;
    const {description, name} = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
            className="block"
            id="name"
            label={t('restaurant.name')}
            onChange={this.handleInputChange}
            type="text"
            value={name}
        />
        <Input
            className="block"
            id="description"
            label={t('restaurant.description')}
            onChange={this.handleInputChange}
            rows={3}
            type="text"
            value={description}
        />
        <div>
          <Button colored onClick={this.handleSubmit} raised type="submit">
            {t('submit')}
          </Button>
          {typeof onCancel === 'function' ?
            <Button accent onClick={this.handleCancel} raised type="reset">
              {t('cancel')}
            </Button>
            : null
          }
        </div>
      </form>
    );
  }
}

export default compose(
  createRestaurant,
  updateRestaurant,
  getActiveAccount,
  getRestaurant
)(connect(mapStateToProps, {})(RestaurantForm));
