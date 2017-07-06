import React from 'react';
import PropTypes from 'prop-types';

import mdl from 'components/mdl';

class Input extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string.isRequired,
    id: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    Input: PropTypes.any,
    floatingLabel: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    rows: PropTypes.number
  };
  static defaultProps = {
    floatingLabel: false,
    type: 'text',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    required: false,
    disabled: false,
    rows: 1,
    Input: props => <input {...props} />
  };
  state = {
    currentValue: this.props.value,
    isFocused: false
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.isFocused) {
      this.setState({currentValue: nextProps.value});
    }
  }
  handleChange = event => {
    const {pattern} = this.props;
    if (!pattern || new RegExp(pattern).test(event.target.value)) {
      this.setState({currentValue: event.target.value});
      this.props.onChange(event);
    }
  }
  handleFocus = event => {
    this.setState({isFocused: true});
    this.props.onFocus(event);
  };
  handleBlur = event => {
    this.setState({isFocused: false});
    this.props.onBlur(event);
  };
  render() {
    const {
      floatingLabel,
      label,
      id,
      className,
      Input,
      ...props
    } = this.props;
    const {currentValue} = this.state;
    return (
      <div
          className={
            'mdl-textfield mdl-js-textfield' +
            (floatingLabel ? ' mdl-textfield--floating-label' : '') +
            (className ? ` ${className}` : '')
          }
      >
        <Input
            {...props}
            className="mdl-textfield__input"
            id={id}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            value={currentValue}
        />
        <label className="mdl-textfield__label" htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }
}

export default mdl(Input);
