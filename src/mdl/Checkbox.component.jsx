import React from 'react';

import mdl from 'mdl/mdl';

class CheckBox extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    checked: React.PropTypes.bool,
    inputClass: React.PropTypes.string,
    label: React.PropTypes.oneOfType([
      React.PropTypes.node,
      React.PropTypes.string
    ]),
    ripple: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    value: React.PropTypes.any
  };
  render() {
    const {
      ripple,
      id,
      label,
      inputClass,
      checked,
      onChange,
      value,
      ...props
    } = this.props;
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
            checked={checked}
            className={'mdl-checkbox__input ' + (inputClass || '')}
            id={id}
            onChange={onChange}
            type="checkbox"
            value={value}
        />
        {typeof label === 'string' ?
          <span className="mdl-checkbox__label">{label}</span> :
          label
        }
      </label>
    );
  }
}

export default mdl(CheckBox);
