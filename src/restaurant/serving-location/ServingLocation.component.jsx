import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';

import {getServingLocation} from 'graphql/restaurant/servingLocation.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

class ServingLocation extends React.Component {
  static PropTypes = {
    servingLocation: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]).isRequired
  };
  toggleExpand = () => {
    this.setState({expand: !this.state.expand});
  };
  render() {
    const {
      getServingLocation: {
        servingLocation: {
          name
        } = typeof this.props.servingLocation === 'object' ? this.props.srevingLocation : {}
      } = {}
    } = this.props;
    return (
      <div
          className="container__item container__item--trigger"
          onClick={this.toggleExpand}
      >
        <div className="container__item__content">
          <div>
            {name}
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  getServingLocation
)(connect(mapStateToProps)(ServingLocation));
