import React from 'react';

import mdl from 'mdl/mdl';

class Button extends React.Component {
  static propTypes = {
    colored: React.PropTypes.bool,
    accent: React.PropTypes.bool,
    raised: React.PropTypes.bool,
    children: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    type: React.PropTypes.string
  };
  render() {
    const {raised, colored, accent, children, className, ...props} = this.props;
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
          {...props}
      >
        {children}
      </button>
    );
  }
}

export default mdl(Button);
