import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import colors from 'styles/colors';
import {minimal, minor, normal} from 'styles/spacing';

@Radium
export default class Input extends React.Component {
  static propTypes = {
    afterInput: PropTypes.node,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string.isRequired,
    id: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    Input: PropTypes.any,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    rows: PropTypes.number
  };
  static defaultProps = {
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
  };
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
  };
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
      afterInput,
      label,
      Input,
      ...props
    } = this.props;
    const {currentValue, isFocused} = this.state;
    return (
      <div style={styles.container}>
        <label
            htmlFor={this.props.id}
            style={[].concat(styles.label, isFocused ? styles.labelFocus : [])}
        >
          {label}
        </label>
        <div style={{display: 'flex', alignItems: 'center', paddingBottom: minor}}>
          <div style={styles.inputContainer}>
            <Input
                {...props}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                ref={c => this.input = c}
                style={Object.assign({}, styles.input, isFocused ? styles.inputFocus : {})}
                value={currentValue}
            />
            <div style={styles.bottom}>
              {isFocused ? <div style={styles.bottomFocus} /> : null}
            </div>
          </div>
          <div style={{marginLeft: normal}}>{afterInput}</div>
        </div>
      </div>
    );
  }
}


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '30rem'
  },
  inputContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  label: {
    colors: colors.foregroundDark,
    opacity: 0.6
  },
  labelFocus: {opacity: 1},
  input: {
    border: 0,
    padding: minimal,
    backgroundColor: colors.inputBackground,
    minHeight: '1.55rem',
    maxHeight: '1.55rem',
    transition: 'max-height 0.3s ease-in-out 0s',
    resize: 'none'
  },
  inputFocus: {
    maxHeight: '10rem',
    height: 'auto'
  },
  bottom: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: '3px',
    backgroundColor: colors.lightGray
  },
  bottomFocus: {
    animation: 'x 0.3s ease 0s forwards 1',
    background: colors.foregroundDark,
    animationName: Radium.keyframes({
      '0%': {flexBasis: 0},
      '100%': {flexBasis: '100%'}
    })
  }
};
