import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {set, equals, get} from 'lodash/fp';
import {servingLocation} from 'walless-graphql';

import Form from 'components/Form.component';
import loadable from 'decorators/loadable';
import ItemsWithLabels from 'components/ItemsWithLabels.component';
import Select from 'components/Select.component';

const mapStateToProps = state => ({t: state.util.translation.t});

@loadable()
class OrdersFilter extends React.Component {
  static propTypes = {
    filters: PropTypes.shape({
      servingLocations: PropTypes.array
    }),
    onFiltersChange: PropTypes.func.isRequired,
    restaurant: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.resetFilter(props, state => this.state = state); // eslint-disable-line
  }
  componentWillReceiveProps(newProps) {
    this.resetFilter(newProps);
  }
  resetFilter = (props, setState = state => this.setState(state)) =>
    setState(props.filters);
  handleStateChange = path => changed => {
    const value = Array.isArray(changed) ?
      changed.map(i => i.value || i)
    : get(['target', 'value'])(changed) || get('value')(changed) || changed;
    this.setState(set(path)(value)(this.state));
  };
  handleSubmit = () => {
    this.props.onFiltersChange(this.state);
  };
  render() {
    const {t, servingLocations = [], filters} = this.props;
    return (
      <Form
          isValid={!equals(this.state)(filters)}
          onSubmit={this.handleSubmit}
      >
        <ItemsWithLabels
            items={[
              {
                label: t('restaurant.order.servingLocation'),
                item: (
                  <Select
                      autoBlur
                      multi
                      onChange={this.handleStateChange('servingLocations')}
                      options={
                        servingLocations.map(servingLocation => ({
                          value: servingLocation.id,
                          label: servingLocation.name
                        }))
                      }
                      value={this.state.servingLocations}
                  />
                )
              },
              {
                label: t('restaurant.order.state.state'),
                item: (
                  <Select
                      autoBlur
                      clearable={false}
                      onChange={this.handleStateChange('state')}
                      options={[
                        {value: 'all', label: t('showAll')},
                        {value: 'completed', label: t('restaurant.order.state.completed')},
                        {value: 'pending', label: t('restaurant.order.state.pending')}
                      ]}
                      value={this.state.state}
                  />
                )
              }
            ]}
        />
      </Form>
    );
  }
}

export default compose(
  connect(mapStateToProps, {}),
  servingLocation.getServingLocationsByRestaurant
)(OrdersFilter);
