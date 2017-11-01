import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {equals, omit} from 'lodash/fp';

import Input from 'components/Input.component';
import Form from 'components/Form.component';
import {servingLocation} from 'walless-graphql';

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
    this.resetForm(props, state => this.state = state); // eslint-disable-line
  }
  componentWillReceiveProps(newProps) {
    if (
      typeof this.props.servingLocation !== typeof newProps.servingLocation ||
      !equals(this.props.getServingLocation)(newProps.getServingLocation)
    ) {
      this.resetForm(newProps);
    }
  }
  resetForm = (props, updateState = state => this.setState(state)) => {
    const {
      servingLocation: {
        name = ''
      } = typeof props.servingLocation === 'object' && props.servingLocation ? props.servingLocation : {}
    } = props;
    updateState({
      name,
      loading: false
    });
  }
  handleInputChange = e => {
    const {id, value} = e.target;
    this.setState({[id]: value});
  };
  handleSubmit = e => {
    this.setState({loading: true});
    e.preventDefault();
    const {
      createServingLocation,
      updateServingLocation,
      restaurant,
      onSubmit,
      servingLocation = typeof this.props.servingLocation === 'object' ? this.props.servingLocation : {}
    } = this.props;
    const finalServingLocation = Object.assign(
      omit(['loading'])(this.state),
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
    const {name, loading} = this.state;
    return (
      <Form
          loading={loading}
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmit}
      >
        <Input
            id="name"
            label={t('restaurant.servingLocation.name')}
            onChange={this.handleInputChange}
            required
            value={name}
        />
      </Form>
    );
  }
}

export default compose(
  connect(mapStateToProps, {}),
  servingLocation.createServingLocation,
  servingLocation.updateServingLocation,
  servingLocation.getServingLocation
)(ServingLocationForm);
