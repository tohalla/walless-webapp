import colors from 'styles/colors';
import {minor} from 'styles/spacing';

@Radium
export default class Checkbox extends PureComponent {
  static propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired
  };
  static defaultProps = {
    checked: false,
    disabled: false
  };
  handleClick = event => {
    event.stopPropagation();
    const {checked, label, onClick} = this.props;
    if (typeof onClick === 'function') onClick(event, {checked, label});
  };
  render() {
    const {checked, disabled, label} = this.props;
    return (
      <div onClick={this.handleClick} style={styles.container}>
        <i
          className='material-icons'
          style={[
            styles.checkbox,
            disabled ? styles.disabled
              : {color: colors.gray}
          ]}
        >
          {checked ? 'check_box' : 'check_box_outline_blank'}
        </i>
        {label ? <div style={styles.label}>{label}</div> : null}
      </div>
    );
  };
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'space-between',
    userSelect: 'none',
    cursor: 'default',
    flex: 0
  },
  label: {
    flex: 0,
    margin: `0 ${minor}`,
    whiteSpace: 'nowrap',
    alignSelf: 'center'
  },
  checkbox: {
    flex: 0,
    fontSize: '20px',
    alignSelf: 'center'
  },
  disabled: {
    color: colors.lightGray
  }
};
