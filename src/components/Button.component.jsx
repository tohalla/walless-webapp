import React from 'react';
import PropTypes from 'prop-types';

import mdl from 'components/mdl';

class Button extends React.Component {
  static propTypes = {
    colored: PropTypes.bool,
    className: PropTypes.string,
    accent: PropTypes.bool,
    raised: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.element
    ]),
    onClick: PropTypes.func,
    type: PropTypes.string,
    style: PropTypes.object
  };
  static defaultProps = {
    type: 'button'
  }
  handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event);
    }
  }
  render() {
    const {
      raised,
      colored,
      accent,
      children,
      className,
      onClick, // eslint-disable-line
      ...props
    } = this.props;
    return (
      <button
          className={
            'mdl-button mdl-js-button' +
            (raised ? ' mdl-button--raised' : '') +
            (
              colored ? ' mdl-button--colored'
              : accent ? ' mdl-button--accent'
              : ''
            ) + (className ? ` ${className}` : '')
          }
          onClick={this.handleClick}
          {...props}
      >
        {children}
      </button>
    );
  }
}

export default mdl(Button);
