import Input from 'components/Input.component';
import colors from 'styles/colors';
import {minor} from 'styles/spacing';

@Radium
export default class TimeInput extends PureComponent {
  static propTypes = {
    afterInput: PropTypes.node,
    value: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    disabled: PropTypes.bool,
    isValid: PropTypes.func,
    id: PropTypes.string,
    required: PropTypes.bool,
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    labelLocation: PropTypes.oneOf(['top', 'left'])
  };
  static defaultProps = {
    onBlur: () => {},
    onChange: () => {},
    isValid: value => /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
    onFocus: () => {},
    required: false,
    disabled: false
  };
  constructor(props) {
    super(props);
    const [hours = '', minutes = ''] = this.props.value ?
      this.props.value.split(':') : [];
    this.state = {
      isFocused: false,
      hours,
      minutes
    };
    this.handleHoursChange = this.handleHoursChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.isFocused) {
      const [hours = '', minutes = ''] = nextProps.value ?
        nextProps.value.split(':') : [];
      this.setState({hours, minutes});
    }
  }
  handleChange = () => typeof this.props.onChange === 'function' &&
    this.props.onChange(
      `${this.state.hours || ''}:${this.state.minutes || ''}`
    );
  handleHoursChange = event => {
    this.setState({hours: event.target.value}, this.handleChange);
    if (event.target.value.length >= 2) this.minutes.focus();
  };
  handleMinutesChange = event => {
    this.setState({minutes: event.target.value}, this.handleChange);
  };
  handleMinutesKeyUp = event =>
    event.keyCode === 8 && !this.state.minutes.length && this.hours.focus();
  handleFocus = event => {
    this.setState({isFocused: true, error: undefined});
    this.props.onFocus(event);
  };
  handleBlur = event => {
    this.setState({
      isFocused: false,
      error: this.props.required && !(this.props.isValid(this.props.value))
    });
    this.props.onBlur(event);
  };
  focus = () => this.hours && !this.state.isFocused && this.hours.focus();
  render() {
    const {
      label,
      afterInput,
      labelLocation,
      isValid, // eslint-disable-line no-unused-vars
      style,
      ...props
    } = this.props;
    const {hours, minutes, isFocused, error} = this.state;
    const inputProps = {
      maxLength: 2,
      plain: true,
      inputStyle: {width: '3rem'},
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    };
    return (
      <div
        onClick={this.focus}
        style={[
          styles.container,
          style,
          labelLocation === 'left' ?
            {flexDirection: 'row', alignItems: 'center'}
            : {flexDirection: 'column'}
        ]}
      >
        {label &&
          <label
            htmlFor={this.props.id}
            style={[].concat(
              styles.label,
              isFocused ? styles.labelFocus : [],
              labelLocation === 'left' ?
                {paddingRight: minor} : []
            )}
          >
            {label}
          </label>
        }
        <div style={{display: 'flex', alignSelf: 'flex-start'}}>
          <div style={styles.inputContainer}>
            <div style={styles.hhmm}>
              <Input
                {...props}
                {...inputProps}
                onChange={this.handleHoursChange}
                pattern={/^$|^([0-9]|0[0-9]|1[0-9]|2[0-3])$/}
                placeholder='hh'
                ref={c => {
                  this.hours = c;
                }}
                value={hours}
              />
              {':'}
              <Input
                {...props}
                {...inputProps}
                onChange={this.handleMinutesChange}
                onKeyUp={this.handleMinutesKeyUp}
                pattern={/^$|^([0-9]|[0-5][0-9])$/}
                placeholder='mm'
                ref={c => {
                  this.minutes = c;
                }}
                value={minutes}
              />
            </div>
            <div style={[].concat(styles.bottom, error ? styles.bottomError : {})}>
              {isFocused ? <div style={styles.bottomFocus} /> : null}
            </div>
          </div>
        </div>
        {afterInput && <div style={{marginLeft: minor}}>{afterInput}</div>}
      </div>
    );
  }
}


const styles = {
  container: {
    display: 'flex',
    maxWidth: '30rem'
  },
  inputContainer: {
    position: 'relative',
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
    position: 'absolute',
    bottom: 3, left: 0, right: 0,
    height: 3,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
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
