import React from 'react';
import PropTypes from 'prop-types';

import mdl from 'components/mdl';

class CheckBox extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    inputClass: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string
    ]),
    ripple: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.any
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
