import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';

import MdlMenu from 'components/MdlMenu.component';
import Button from 'components/Button.component';
import {getMenu} from 'graphql/restaurant/menu.queries';

const mapStateToProps = state => ({
  language: state.util.translation.language,
  t: state.util.translation.t
});

class Menu extends React.Component {
  static PropTypes = {
    menu: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]).isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.object.isRequired,
      onClick: PropTypes.func.isRequired
    })),
    expand: PropTypes.bool
  };
  static defaultProps = {
    expand: false
  };
  constructor(props) {
    super(props);
    const {expand} = props;
    this.state = {
      expand
    };
  }
  toggleExpand = () => {
    this.setState({expand: !this.state.expand});
  };
  render() {
    const {
      getMenu: {
        menu: {
          information: {
            [this.props.language]: {
              name, description
            } = {}
          },
          id
        }
      } = {menu:
        typeof this.props.menu === 'object' && this.props.menu ? this.props.menu : {}
      },
      actions
    } = this.props;
    const {expand} = this.state;
    return (
      <div
          className="trigger container"
          onClick={this.toggleExpand}
      >
        <div className="container__row">
          <div className="container__item container__item__content">
            <h6>
              {name}
            </h6>
            <div>
              {description}
            </div>
          </div>
          {
            actions && actions.length ?
              <div className="container__item">
                <Button
                    className="mdl-button mdl-js-button mdl-button--icon"
                    id={`menu-actions-${id}`}
                    type="button"
                >
                  <i className="material-icons">{'more_vert'}</i>
                </Button>
                <MdlMenu htmlFor={`menu-actions-${id}`}>
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
        {
          expand ?
            <div className="container__row">
              <div className="container__item container__item__content">
                {'preview'}
              </div>
            </div>
          : null
        }
      </div>
    );
  }
}

export default compose(
  connect(mapStateToProps),
  getMenu
)(Menu);
