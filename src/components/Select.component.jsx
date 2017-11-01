import ReactSelect from 'react-select';
import color from 'color';

import {normal, minor} from 'styles/spacing';
import colors from 'styles/colors';
import shadow from 'styles/shadow';

@Radium
export default class Select extends React.Component {
  static propTypes = {
    clearable: PropTypes.bool,
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    options: PropTypes.arrayOf(PropTypes.object).isRequired
  };
  handleRenderValue = value => <div style={styles.value}>{value.label}</div>;
  handleRenderInput = props => <input {...props} style={styles.input} />;
  render() {
    const {style, options, ...props} = this.props;
    return (
      <div
          style={[
            {
              minWidth: `${.6 * (1 + (this.props.clearable ? 1 : 0) + options.reduce((length, option) =>
                option.label && option.label.length > length ? option.label.length : length,
                0
              ))}rem`,
              border: `1px solid ${colors.border}`
            },
            style
          ]}
      >
        <ReactSelect
            inputRenderer={this.handleRenderInput}
            menuContainerStyle={Object.assign({}, styles.menuContainer)}
            optionComponent={Option}
            options={options}
            style={styles.select}
            valueRenderer={this.handleRenderValue}
            {...props}
        />
      </div>
    );
  }
}

@Radium
class Option extends React.Component {
  blockEvent = event => {
    event.preventDefault();
    event.stopPropagation();
    if ((event.target.tagName !== 'A') || !('href' in event.target)) {
      return;
    }
    if (event.target.target) {
      window.open(event.target.href, event.target.target);
    } else {
      window.location.href = event.target.href;
    }
  };
  handleMouseDown = event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  };
  handleMouseEnter = event => this.onFocus(event);
  handleMouseMove = event => this.onFocus(event);
  handleTouchEnd = event => {
    if (this.dragging) return;
    this.handleMouseDown(event);
  };
  handleTouchMove = event => this.dragging = true;
  handleTouchStart = event => this.dragging = false;
  onFocus = event => {
    if (!this.props.isFocused) {
      this.props.onFocus(this.props.option, event);
    }
  };
  render() {
    const {
      option,
      instancePrefix,
      optionIndex,
      children
    } = this.props;
    return option.disabled ? (
      <div onClick={this.blockEvent} onMouseDown={this.blockEvent} style={styles.option}>
        {children}
      </div>
    ) : (
      <div
          id={instancePrefix + '-option-' + optionIndex}
          onMouseDown={this.handleMouseDown}
          onMouseEnter={this.handleMouseEnter}
          onMouseMove={this.handleMouseMove}
          onTouchEnd={this.handleTouchEnd}
          onTouchMove={this.handleTouchMove}
          onTouchStart={this.handleTouchStart}
          role="option"
          style={styles.option}
          title={option.title}
      >
        {children}
      </div>
    );
  }
};

const styles = {
  select: {
    background: 'none',
    boxShadow: 'none',
    borderRadius: 0,
    border: 'none'
  },
  menuContainer: Object.assign({
    borderRadius: 0,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.backgroundLight
  }, shadow.small),
  option: {
    color: colors.foregroundDark,
    padding: `${minor} ${normal}`,
    cursor: 'pointer',
    flex: 1,
    [':hover']: {
      backgroundColor: color(colors.background).darken(0.05).hex()
    }
  },
  value: {color: colors.foregroundDark},
  input: {
    margin: 0,
    padding: 0,
    background: 'none',
    border: 'none'
  }
};
