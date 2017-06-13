import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {equals} from 'lodash/fp';

import {getActiveAccount} from 'graphql/account/account.queries';
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
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    createRestaurant: PropTypes.func.isRequired,
    updateRestaurant: PropTypes.func.isRequired,
    restaurant: PropTypes.oneOfType([
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
      typeof this.props.restaurant !== typeof newProps.restaurant ||
      !equals(this.props.getRestaurant)(newProps.getRestaurant)
    ) {
      this.resetForm(newProps);
    }
  }
  resetForm = (props, updateState = this.setState) => {
    const {
      getRestaurant: {
        restaurant: {
          name = '',
          description = ''
        }
      } = {restaurant: typeof props.restaurant === 'object' && props.restaurant ? props.restaurant : {}}
    } = props;
    updateState({
      name,
      description
    });
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
      getActiveAccount: {account} = {},
      getRestaurant: {
        restaurant = typeof this.props.restaurant === 'object' ? this.props.restaurant : {}
      } = {}
    } = this.props;
    const finalRestaurant = Object.assign({}, this.state,
      restaurant ? {id: restaurant.id} : null,
      {createdBy: account.id}
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
