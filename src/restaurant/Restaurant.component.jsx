import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';

import {getRestaurant} from 'graphql/restaurant/restaurant.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

class Restaurant extends React.Component {
  static propTypes = {
    restaurant: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.object
    ])
  };
  render() {
    if (this.props.getRestaurant && typeof this.props.getRestaurant.restaurant === 'object') {
      const {
        getRestaurant: {restaurant: {name, description}} = {restaurant: this.props.restaurant},
        t
      } = this.props;
      return (
        <div className="container container--distinct">
          <h2>{name}</h2>
          <table>
            <tbody>
              <tr>
                <th>{t('restaurant.description')}</th>
                <td>{description}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  }
}

export default compose(getRestaurant)(connect(mapStateToProps)(Restaurant));
