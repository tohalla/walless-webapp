import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';

import MdlMenu from 'mdl/MdlMenu.component';
import {getMenu} from 'graphql/restaurant/menu.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

class Menu extends React.Component {
  static PropTypes = {
    menu: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.number
    ]).isRequired,
    actions: React.PropTypes.arrayOf(React.PropTypes.shape({
      text: React.PropTypes.object.isRequired,
      onClick: React.PropTypes.func.isRequired
    })),
    expand: React.PropTypes.bool
  };
  static defaultProps = {
    expand: false
  };
  render() {
    if (typeof this.props.menu !== 'object') {
      return null;
    }
    const {menu: {name, description, id}, t, expand, actions} = this.props;
    return expand ? (
      <div className="container container--distinct">
        <table>
          <tbody>
            <tr>
              <th>{t('restaurant.menus.creation.name')}</th>
              <td>{name}</td>
            </tr>
            <tr>
              <th>{t('restaurant.menus.creation.description')}</th>
              <td>{description}</td>
            </tr>
          </tbody>
        </table>
      </div>
    ) : (
      <div className="container__item">
        <div className="container__item__content">
          <div>
            {name}
          </div>
          <div>
            {description}
          </div>
        </div>
        {
          actions && actions.length ?
            <div className="container__item__actions">
              <button
                  className="mdl-button mdl-js-button mdl-button--icon"
                  id={`menu-actions-${id}`}
              >
                <i className="material-icons">{'more_vert'}</i>
              </button>
              <MdlMenu htmlFor={`menu-actions-${id}`}>
                {actions.map((action, index) =>
                  <li
                      className="mdl-menu__item"
                      key={index}
                      onClick={action.onClick}
                  >
                    {action.text}
                  </li>
                )}
              </MdlMenu>
            </div>
          : null
        }
      </div>
    );
  }
}

export default compose(
  getMenu
)(connect(mapStateToProps)(Menu));
