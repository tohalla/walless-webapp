import React from 'react';
import {findDOMNode} from 'react-dom';

import mdl from 'mdl/mdl';

class Input extends React.Component {
  static propTypes = {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    label: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string,
    className: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    floatingLabel: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    required: React.PropTypes.bool,
    rows: React.PropTypes.number
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
