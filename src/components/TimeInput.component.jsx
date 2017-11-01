import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Input from 'components/Input.component';
import colors from 'styles/colors';
import {minor} from 'styles/spacing';

@Radium
export default class TimeInput extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool
  };
  static defaultProps = {
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    required: false,
    disabled: false
  };
  state = {
    currentValue: this.props.value,
    isFocused: false,
    hours: '',
    minutes: ''
  };
  componentWillReceiveProps(nextProps) {
    if (!this.state.isFocused) {
      this.setState({currentValue: nextProps.value});
    }
  }
  handleHoursChange = event => {
    this.setState({hours: event.target.value});
    if (event.target.value.length >= 2) this.minutes.focus();
  };
  handleMinutesChange = event => this.setState({minutes: event.target.value});
  handleMinutesKeyUp = event =>
    event.keyCode === 8 && !this.state.minutes.length && this.hours.focus();
  handleFocus = event => {
    this.setState({isFocused: true, error: undefined});
    this.props.onFocus(event);
  };
  handleBlur = event => {
    this.setState({
      isFocused: false,
      error: this.props.required && !(this.props.hours || this.minutes)
    });
    this.props.onBlur(event);
  };
  render() {
    const {label, ...props} = this.props;
    const {hours, minutes, isFocused, error} = this.state;
    return (
      <div style={styles.container}>
        {label &&
          <label
              htmlFor={this.props.id}
              style={[].concat(styles.label, isFocused ? styles.labelFocus : [])}
          >
          {label}
          </label>
        }
        <div style={{display: 'flex', alignSelf: 'flex-start', paddingBottom: minor}}>
          <div style={styles.inputContainer}>
            <div style={styles.hhmm}>
              <Input
                  {...props}
                  maxLength={2}
                  onBlur={this.handleBlur}
                  onChange={this.handleHoursChange}
                  onFocus={this.handleFocus}
                  pattern={/^$|^([0-9]|0[0-9]|1[0-9]|2[0-3])$/}
                  placeholder="hh"
                  plain
                  ref={c => this.hours = c}
                  size={2}
                  value={hours}
              />
              {':'}
              <Input
                  {...props}
                  maxLength={2}
                  onBlur={this.handleBlur}
                  onChange={this.handleMinutesChange}
                  onFocus={this.handleFocus}
                  onKeyUp={this.handleMinutesKeyUp}
                  pattern={/^$|^([0-9]|[0-5][0-9])$/}
                  placeholder="mm"
                  plain
                  ref={c => this.minutes = c}
                  size={2}
                  value={minutes}
              />
            </div>
            <div style={[].concat(styles.bottom, error ? styles.bottomError : {})}>
              {isFocused ? <div style={styles.bottomFocus} /> : null}
            </div>
          </div>
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
    backgroundColor: colors.inputBackground,
    alignItems: 'stretch'
  },
  hhmm: {display: 'flex', flexDirection: 'row', alignItems: 'center'},
  label: {
    colors: colors.foregroundDark,
    opacity: 0.6
  },
  labelFocus: {opacity: 1},
  bottom: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: '3px',
    backgroundColor: colors.lightGray
  },
  bottomError: {
    backgroundColor: colors.red
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
