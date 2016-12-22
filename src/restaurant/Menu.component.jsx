import React from 'react';
import {connect} from 'react-redux';

import MdlMenu from 'mdl/MdlMenu.component';

const mapStateToProps = state => ({t: state.util.translation.t});

class Menu extends React.Component {
  static PropTypes = {
    menu: React.PropTypes.object.isRequired
  }
  render() {
    const {menu: {name, description, id}, t} = this.props;
    return (
      <div className="container__item">
        <div className="container__item__content">
          <div>
            {name}
          </div>
          <div>
            {description}
          </div>
        </div>
        <div className="container__item__actions">
          <button
              className="mdl-button mdl-js-button mdl-button--icon"
              id={`menu-actions-${id}`}
          >
            <i className="material-icons">{'more_vert'}</i>
          </button>
          <MdlMenu htmlFor={`menu-actions-${id}`}>
            <li className="mdl-menu__item">{t('restaurant.menus.edit')}</li>
            <li className="mdl-menu__item">{t('restaurant.menus.delete')}</li>
          </MdlMenu>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, {})(Menu);
