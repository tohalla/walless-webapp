import React from 'react';

import MdlMenu from 'mdl/MdlMenu.component';

export default class MenuItem extends React.Component {
  static PropTypes = {
    allowActions: React.PropTypes.bool,
    menuItem: React.PropTypes.object.isRequired
  }
  render() {
    const {
      menuItem: {name, description, id},
      className,
      allowActions
    } = this.props;
    return (
      <div className={className ? className + ' container__item' : 'container__item'}>
        <div className="container__item__content">
          <div>
            {name}
          </div>
          <div>
            {description}
          </div>
        </div>
        {allowActions ?
          <div className="container__item__actions">
            <button
                className="mdl-button mdl-js-button mdl-button--icon"
                id={`menu-item-actions-${id}`}
            >
              <i className="material-icons">{'more_vert'}</i>
            </button>
            <MdlMenu htmlFor={`menu-item-actions-${id}`}>
              <li className="mdl-menu__item">{'Delete'}</li>
            </MdlMenu>
          </div>
        : null}
      </div>
    );
  }
}
