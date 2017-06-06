import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getActiveAccount} from 'graphql/account/account.queries';
import Input from 'mdl/Input.component';
import Button from 'mdl/Button.component';
import {
  createServingLocation,
  updateServingLocation
} from 'graphql/restaurant/servingLocationn.mutations';
import {getServingLocation} from 'graphql/restaurant/servingLocation.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

class ServingLocationForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    createServingLocation: PropTypes.func.isRequired,
    updateServingLocation: PropTypes.func.isRequired,
    restaurant: PropTypes.object.isRequired,
    servingLocation: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ])
  };
  constructor(props) {
    super(props);
    const {
      getServingLocation: {
        servingLocation
      } = {servingLocation: typeof props.servingLocation === 'object' ? props.servingLocation : {}}
    } = props;
    this.state = {
      name: servingLocation.name || ''
    };
  }
  componentWillReceiveProps(newProps) {
    if (typeof this.props.servingLocation !== typeof newProps.servingLocation) {
      // should reset inputs when servingLocation information fetched with given id
      const {
        getServingLocation: {
          servingLocation: {
            name
          }
        } = {servingLocation: typeof newProps.servingLocation === 'object' ? newProps.servingLocation : {}}
      } = newProps;
      this.setState({
        name
      });
    }
  }
  handleInputChange = e => {
    const {id, value} = e.target;
    this.setState({[id]: value});
  };
  handleSubmit = e => {
    e.preventDefault();
    const {
      createServingLocation,
      updateServingLocation,
      restaurant,
      onSubmit,
      getActiveAccount: {account} = {},
      getServingLocation: {
        servingLocation = typeof this.props.servingLocation === 'object' ? this.props.servingLocation : {}
      } = {}
    } = this.props;
    const finalServingLocation = Object.assign({}, this.state,
      servingLocation ? {id: servingLocation.id} : null,
      {
        restaurant: restaurant.id,
        createdBy: account.id
      }
    );
    (servingLocation && servingLocation.id ?
      updateServingLocation(finalServingLocation) :
      createServingLocation(finalServingLocation)
    )
      .then(() => onSubmit());
  };
  handleToggle = e => {
    this.setState({[e.target.id]: !this.state[e.target.id]});
  };
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  };
  render() {
    const {t} = this.props;
    const {name} = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
            className="block"
            id="name"
            label={t('restaurant.servingLocations.name')}
            onChange={this.handleInputChange}
            type="text"
            value={name}
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
  createServingLocation,
  updateServingLocation,
  getActiveAccount,
  getServingLocation
)(connect(mapStateToProps, {})(ServingLocationForm));
