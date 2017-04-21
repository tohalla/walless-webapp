import React from 'react';

import mdl from 'mdl/mdl';

class Button extends React.Component {
  static propTypes = {
    colored: React.PropTypes.bool,
    accent: React.PropTypes.bool,
    raised: React.PropTypes.bool,
    children: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.element
    ]),
    onClick: React.PropTypes.func,
    type: React.PropTypes.string
  };
  static defaultProps = {
    type: 'button'
  }
  handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    if(typeof this.props.onClick === 'function') {
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
