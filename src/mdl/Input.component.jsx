import React from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';

import mdl from 'mdl/mdl';

class Input extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    floatingLabel: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    rows: PropTypes.number
  };
  static defaultProps = {
    floatingLabel: false,
    type: 'text',
    required: false,
    disabled: false,
    rows: 1
  };
  componentDidUpdate(prevProps) {
    if (this.props.disabled !== prevProps.disabled) {
      findDOMNode(this).MaterialTextfield.checkDisabled();
    }
    if (
      this.props.value !== prevProps.value &&
      this.inputRef !== document.activeElement
    ) {
      findDOMNode(this).MaterialTextfield.change(this.props.value);
    }
  }
  render() {
    const {
      floatingLabel,
      label,
      rows,
      id,
      className,
      ...props
    } = this.props;
    return (
      <div
          className={
            'mdl-textfield mdl-js-textfield' +
            (floatingLabel ? ' mdl-textfield--floating-label' : '') +
            (className ? ` ${className}` : '')
          }
      >
        {rows > 1 ?
          <textarea
              className="mdl-textfield__input"
              id={id}
              {...props}
          /> :
          <input
              className="mdl-textfield__input"
              id={id}
              {...props}
          />
        }
        <label className="mdl-textfield__label" htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }
}

export default mdl(Input);
