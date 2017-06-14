import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getRestaurant} from 'graphql/restaurant/restaurant.queries';
import MdlMenu from 'components/MdlMenu.component';
import Button from 'components/Button.component';
import RestaurantForm from 'restaurant/RestaurantForm.component';
import WithActions from 'util/WithActions.component';

const mapStateToProps = state => ({t: state.util.translation.t});

class Restaurant extends React.Component {
  static propTypes = {
    restaurant: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object
    ])
  };
  state = {
    action: null
  };
  handleRestaurantSubmit = () => {
    this.props.getRestaurant.data.refetch();
    this.setState({action: null});
  };
  handleActionChange = action => event => {
    this.setState({action});
  };
  render() {
    if (this.props.getRestaurant && typeof this.props.getRestaurant.restaurant === 'object') {
      const {
        getRestaurant: {
          restaurant: restaurant
        } = {restaurant: this.props.restaurant},
        t
      } = this.props;
      const actions = {
        edit: {
          hide: true,
          hideReturn: true,
          hideItems: true,
          render: () => (
            <RestaurantForm
                onCancel={this.handleActionChange()}
                onSubmit={this.handleRestaurantSubmit}
                restaurant={restaurant}
            />
          )
        }
      };
      const {action} = this.state;
      return (
        <WithActions
            action={action ? action.name : null}
            actions={actions}
            hideActions
            onActionChange={this.handleActionChange}
        >
          <div className="container__row">
            <h2>{restaurant.name}</h2>
            <div className="container__item">
              <Button
                  className="mdl-button mdl-js-button mdl-button--icon"
                  id="restaurant-actions"
                  type="button"
              >
                <i className="material-icons">{'more_vert'}</i>
              </Button>
              <MdlMenu htmlFor="restaurant-actions">
                  <li
                      className="mdl-menu__item"
                      onClick={this.handleActionChange({name: 'edit'})}
                  >
                    {'edit'}
                  </li>
              </MdlMenu>
            </div>
          </div>
          <table>
            <tbody>
              <tr>
                <th>{t('restaurant.description')}</th>
                <td>{restaurant.description}</td>
              </tr>
            </tbody>
          </table>
        </WithActions>
      );
    }
    return null;
  }
}

export default compose(getRestaurant)(connect(mapStateToProps)(Restaurant));
