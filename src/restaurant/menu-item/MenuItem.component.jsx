import React from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';

import MdlMenu from 'mdl/MdlMenu.component';
import {getMenuItem} from 'graphql/restaurant/menuItem.queries';

class MenuItem extends React.Component {
  static PropTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.object.isRequired,
      onClick: PropTypes.func.isRequired
    })),
    menuItem: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]).isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string
  };
  handleClick = () => {
    const {
      getMenuItem: {
        menuItem
      } = {menuItem: typeof this.props.menuItem === 'object' ? this.props.menuItem : {}},
      onClick
    } = this.props;
    if (typeof onClick === 'function') {
      return onClick(menuItem);
    }
  };
  render() {
    const {
      getMenuItem: {
        menuItem: {
          name,
          description,
          id,
          files
        }
      } = {menuItem: typeof this.props.menuItem === 'object' ? this.props.menuItem : {}},
      className,
      actions
    } = this.props;
    return (
      <div
          className={className ? className + ' container__item' : 'container__item'}
          onClick={this.handleClick}
      >
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
                type="button"
            >
              <i className="material-icons">{'more_vert'}</i>
            </button>
            <MdlMenu htmlFor={`menu-item-actions-${id}`}>
              {actions.map((action, index) => (
                <li
                    className="mdl-menu__item"
                    key={index}
                    onClick={action.onClick}
                >
                  {action.text}
                </li>
              ))}
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
