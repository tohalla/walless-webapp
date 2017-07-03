import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';

import MdlMenu from 'components/MdlMenu.component';
import {getMenuItem} from 'graphql/restaurant/menuItem.queries';

const mapStateToProps = state => ({
  language: state.util.translation.language,
  t: state.util.translation.t
});

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
      menuItem = typeof this.props.menuItem === 'object' && this.props.menuItem ? this.props.menuItem : {},
      onClick
    } = this.props;
    if (typeof onClick === 'function') {
      return onClick(menuItem);
    }
  };
  render() {
    const {
      menuItem: {
        information: {
          [this.props.language]: {
            name, description
          } = {}
        },
        id,
        images,
        price,
        currency: {symbol}
      } = typeof this.props.menuItem === 'object' && this.props.menuItem ? this.props.menuItem : {},
      className,
      actions
    } = this.props;
    return (
      <div
          className={(className || 'container__row') + (this.props.onClick ? ' trigger' : '')}
          onClick={this.handleClick}
      >
        <div className="container__item container__item__thumbnail">
          {images.length ? <img src={images[0].uri} /> : null}
        </div>
        <div className="container__item container__item__content">
          <h6>
            {name}
          </h6>
          <div>
            {description}
          </div>
        </div>
        <div className="container__item">
          {`${price} ${symbol}`}
        </div>
        {actions && actions.length ?
          <div className="container__item">
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
                  {action.label}
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
  connect(mapStateToProps),
  getMenuItem
)(MenuItem);
