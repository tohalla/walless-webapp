import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {equals} from 'lodash/fp';

import Input from 'components/Input.component';
import Button from 'components/Button.component';
import {
  createServingLocation,
  updateServingLocation
} from 'graphql/restaurant/servingLocation.mutations';
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
    this.resetForm(props, state => this.state = state);
  }
  componentWillReceiveProps(newProps) {
    if (
      typeof this.props.servingLocation !== typeof newProps.servingLocation ||
      !equals(this.props.getServingLocation)(newProps.getServingLocation)
    ) {
      this.resetForm(newProps);
    }
  }
  resetForm = (props, updateState = this.setState) => {
    const {
      getServingLocation: {
        servingLocation: {
          name = ''
        }
      } = {servingLocation: typeof props.servingLocation === 'object' && props.servingLocation ? props.servingLocation : {}}
    } = props;
    updateState({
      name
    });
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
      getServingLocation: {
        servingLocation = typeof this.props.servingLocation === 'object' ? this.props.servingLocation : {}
      } = {}
    } = this.props;
    const finalServingLocation = Object.assign({}, this.state,
      servingLocation ? {id: servingLocation.id} : null,
      {
        restaurant: restaurant.id
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
  getServingLocation
)(connect(mapStateToProps, {})(ServingLocationForm));
