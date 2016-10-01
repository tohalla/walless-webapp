import React from 'react';
import {findDOMNode} from 'react-dom';

import mdl from './mdl';

class Input extends React.Component {
  static propTypes = {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    label: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    floatingLabel: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    required: React.PropTypes.bool
  };
  static defaultProps = {
    floatingLabel: false,
    type: 'text',
    required: false,
    disabled: false
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
  render = () => (
    <div className={
      'mdl-textfield mdl-js-textfield' +
      (this.props.floatingLabel ? ' mdl-textfield--floating-label' : '')
    }>
      <input
          className="mdl-textfield__input"
          disabled={this.props.disabled}
          id={this.props.id}
          onChange={this.props.onChange}
          required={this.props.required}
          type={this.props.type}
          value={this.props.value}
      />
      <label className="mdl-textfield__label" htmlFor={this.props.id}>
        {this.props.label}
      </label>
    </div>
  );
}

export default mdl(Input);
