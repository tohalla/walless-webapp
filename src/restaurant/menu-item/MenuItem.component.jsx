import React from 'react';
import {compose} from 'react-apollo';

import MdlMenu from 'mdl/MdlMenu.component';
import {getMenuItem} from 'graphql/restaurant/menuItem.queries';

class MenuItem extends React.Component {
  static PropTypes = {
    actions: React.PropTypes.arrayOf(React.PropTypes.shape({
      text: React.PropTypes.object.isRequired,
      onClick: React.PropTypes.func.isRequired
    })),
    menuItem: React.PropTypes.object.isRequired
  }
  render() {
    if (typeof this.props.menuItem !== 'object') {
      return null;
    }
    const {
      menuItem: {name, description, id, files},
      className,
      actions
    } = this.props;
    return (
      <div className={className ? className + ' container__item' : 'container__item'}>
        <div className="container__item__thumbnail">
          {files.length ? <img src={files[0].uri} /> : null}
        </div>
        <div className="container__item__content">
          <div>
            {name}
          </div>
          <div>
            {description}
          </div>
        </div>
        {actions && actions.length ?
          <div className="container__item__actions">
            <button
                className="mdl-button mdl-js-button mdl-button--icon"
                id={`menu-item-actions-${id}`}
            >
              <i className="material-icons">{'more_vert'}</i>
            </button>
            <MdlMenu htmlFor={`menu-item-actions-${id}`}>
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
        : null}
      </div>
    );
  }
}

export default compose(
  getMenuItem
)(MenuItem);
