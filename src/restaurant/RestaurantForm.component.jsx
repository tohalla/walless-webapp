import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {reduce, set, get, equals} from 'lodash/fp';

import {getActiveAccount} from 'graphql/account/account.queries';
import Input from 'components/Input.component';
import Button from 'components/Button.component';
import {
  createRestaurant,
  updateRestaurant,
  createRestaurantInformation,
  updateRestaurantInformation
  } from 'graphql/restaurant/restaurant.mutations';
import {getRestaurant} from 'graphql/restaurant/restaurant.queries';
import Tabbed from 'components/Tabbed.component';

const mapStateToProps = state => ({
  languages: state.util.translation.languages,
  t: state.util.translation.t
});

class RestaurantForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onError: PropTypes.func,
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
          information
        }
      } = {restaurant: typeof props.restaurant === 'object' && props.restaurant ? props.restaurant : {}}
    } = props;
    updateState({
      information,
      activeLanguage: 'en'
    });
  };
  handleInputChange = path => event => {
    const {value} = event.target;
    this.setState(set(path)(value)(this.state));
  };
  handleSubmit = async e => {
    e.preventDefault();
    const {
      createRestaurant,
      updateRestaurant,
      createRestaurantInformation,
      updateRestaurantInformation,
      onSubmit,
      onError,
      getActiveAccount: {account} = {},
      getRestaurant: {
        restaurant: originalRestaurant
      } = {restaurant: typeof this.props.restaurant === 'object' ? this.props.restaurant : {}}
    } = this.props;
    const {
      activeLanguage, // eslint-disable-line
      information,
      ...restaurantOptions
    } = this.state;
    const finalRestaurant = Object.assign({}, restaurantOptions,
      originalRestaurant ? {id: originalRestaurant.id} : null,
      {createdBy: account.id}
    );
    try {
      const {data} = await (originalRestaurant && originalRestaurant.id ?
        updateRestaurant(finalRestaurant) : createRestaurant(finalRestaurant)
      );
      const [mutation] = Object.keys(data);
      const {[mutation]: {restaurant: {id: restaurantId}}} = data;
      await Promise.all([].concat(
        Object.keys(information).map(key =>
          mutation !== 'createRestaurant' && get(['information', key])(originalRestaurant) ?
            updateRestaurantInformation(Object.assign({language: key, restaurant: restaurantId}, information[key]))
          : createRestaurantInformation(Object.assign({language: key, restaurant: restaurantId}, information[key]))
        )
      ));
      onSubmit();
    } catch (error) {
      if (typeof onError === 'function') {
       return onError(error);
      }
      throw new Error(error);
    };
  };
  handleTabChange = tab => this.setState({activeLanguage: tab});
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  }
  render() {
    const {t, onCancel, languages} = this.props;
    const {activeLanguage, information} = this.state;
    const tabs = reduce((prev, value) => Object.assign({}, prev, {
      [value.locale]: {
        label: value.name,
        render: () => (
          <div>
            <Input
                className="block"
                label={t('restaurant.name')}
                onChange={this.handleInputChange(['information', value.locale, 'name'])}
                type="text"
                value={get([value.locale, 'name'])(information) || ''}
            />
            <Input
                className="block"
                label={t('restaurant.description')}
                onChange={this.handleInputChange(['information', value.locale, 'description'])}
                rows={3}
                type="text"
                value={get([value.locale, 'description'])(information) || ''}
            />
          </div>
        )
      }
    }), {})(languages);
    return (
      <form onSubmit={this.handleSubmit}>
        <Tabbed
            onTabChange={this.handleTabChange}
            tab={activeLanguage}
            tabs={tabs}
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
  getRestaurant,
  createRestaurantInformation,
  updateRestaurantInformation
)(connect(mapStateToProps, {})(RestaurantForm));
