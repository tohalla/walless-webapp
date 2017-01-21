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
    if (typeof this.props.restaurant !== 'object') {
      return null;
    }
    const {restaurant: {name, description}, t} = this.props;
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
}

export default compose(getRestaurant)(connect(mapStateToProps)(Restaurant));
