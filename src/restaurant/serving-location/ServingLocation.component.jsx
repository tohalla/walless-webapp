import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';

import MdlMenu from 'components/MdlMenu.component';
import Button from 'components/Button.component';
import {getServingLocation} from 'graphql/restaurant/servingLocation.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

class ServingLocation extends React.Component {
  static PropTypes = {
    servingLocation: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]).isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.object.isRequired,
      onClick: PropTypes.func.isRequired
    }))
  };
  render() {
    const {
      servingLocation: {
        id,
        name
      } = typeof this.props.servingLocation === 'object' && this.props.servingLocation ? this.props.servingLocation : {},
      actions
    } = this.props;
    return (
      <div className="container__row">
        <div className="container__item container__item__content">
          <div>
            {name}
          </div>
        </div>
        {
          actions && actions.length ?
            <div className="container__item">
              <Button
                  className="mdl-button mdl-js-button mdl-button--icon"
                  id={`serving-location-actions-${id}`}
                  type="button"
              >
                <i className="material-icons">{'more_vert'}</i>
              </Button>
              <MdlMenu htmlFor={`serving-location-actions-${id}`}>
                {actions.map((action, index) => (
                  <li
                      className="mdl-menu__item"
                      key={index}
                      onClick={action.onClick}
                  >
                    {action.label}
                  </li>
                ))}
              </MdlMenu>
            </div>
          : null
        }
      </div>
    );
  }
}

export default compose(
  getServingLocation
)(connect(mapStateToProps)(ServingLocation));
