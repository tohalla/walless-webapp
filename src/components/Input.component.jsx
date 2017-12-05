import colors from 'styles/colors';
import {minor} from 'styles/spacing';

@Radium
export default class Input extends PureComponent {
  static propTypes = {
    afterInput: PropTypes.node,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    Input: PropTypes.any,
    size: PropTypes.number,
    inputStyle: PropTypes.any,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    rows: PropTypes.number,
    plain: PropTypes.bool,
    pattern: PropTypes.oneOfType([
      PropTypes.instanceOf(RegExp),
      PropTypes.string
    ]),
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    labelLocation: PropTypes.oneOf(['top', 'left'])
  };
  static defaultProps = {
    type: 'text',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    required: false,
    plain: false,
    disabled: false,
    rows: 1,
    Input: 'input'
  };
  state = {
    currentValue: this.props.value,
    isFocused: false
  };
  componentWillReceiveProps(nextProps) {
    if (!this.state.isFocused) this.setState({currentValue: nextProps.value});
  }
  handleChange = event => {
    const {pattern} = this.props;
    if (!pattern || new RegExp(pattern).test(event.target.value)) {
      this.setState({currentValue: event.target.value});
      this.props.onChange(event);
    }
  };
  handleFocus = event => {
    this.setState({isFocused: true, error: undefined});
    this.props.onFocus(event);
  };
  handleBlur = event => {
    this.setState({
      isFocused: false,
      error: this.props.required && !this.props.value
    });
    this.props.onBlur(event);
  };
  focus = () => this.input && !this.state.isFocused && this.input.focus();
  render() {
    const {
      afterInput,
      label,
      Input,
      plain,
      inputStyle,
      labelLocation,
      size,
      style,
      ...props
    } = this.props;
    const {currentValue, isFocused, error} = this.state;
    const input = (
      <Input
        {...props}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        ref={c => {
          this.input = c;
        }}
        style={Object.assign(
          {},
          styles.input,
          inputStyle,
          typeof size === 'number' ? {width: `${size * 1.2}rem`} : {},
          isFocused ? styles.inputFocus : {}
        )}
        value={currentValue}
      />
    );
    return plain ? (input) : (
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
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={styles.inputContainer}>
            {input}
            <div style={[].concat(styles.bottom, error ? styles.bottomError : {})}>
              {isFocused ? <div style={styles.bottomFocus} /> : null}
            </div>
          </div>
          <div style={{marginLeft: minor}}>{afterInput}</div>
        </div>
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
    alignItems: 'stretch'
  },
  label: {
    colors: colors.foregroundDark,
    opacity: 0.8
  },
  labelFocus: {opacity: 1},
  input: {
    border: 0,
    padding: minor,
    backgroundColor: colors.inputBackground,
    resize: 'none'
  },
  inputFocus: {
    height: 'auto'
  },
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
