import React from 'react';

import mdl from 'mdl/mdl';

class Button extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    inputClass: React.PropTypes.string,
    label: React.PropTypes.oneOfType([
      React.PropTypes.node,
      React.PropTypes.string
    ]),
    ripple: React.PropTypes.bool
  };
  render() {
    const {ripple, id, label, inputClass, ...props} = this.props;
    return (
      <label
          className={
            'mdl-checkbox mdl-js-checkbox' +
            (ripple ? ' mdl-js-ripple-effect' : '')
          }
          htmlFor={id}
          {...props}
      >
        <input
            className={'mdl-checkbox__input ' + (inputClass || '')}
            id={id}
            type="checkbox"
        />
        {typeof label === 'string' ?
          <span className="mdl-checkbox__label">{label}</span> :
          label
        }
      </label>
    );
  }
}

export default mdl(Button);
