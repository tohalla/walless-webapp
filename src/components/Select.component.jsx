import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import Radium from 'radium';
import color from 'color';

import {normal, minor} from 'styles/spacing';
import colors from 'styles/colors';
import shadow from 'styles/shadow';

@Radium
export default class Select extends React.Component {
  static propTypes = {
    dark: PropTypes.bool,
    clearable: PropTypes.bool,
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    options: PropTypes.arrayOf(PropTypes.object).isRequired
  };
  handleRenderValue = value => (
    <div style={Object.assign({}, styles.value, this.props.dark ? styles.valueDark : {})}>
      {value.label}
    </div>
  );
  handleRenderInput = props => (
    <input
        {...props}
        style={Object.assign({}, styles.input, this.props.dark ? styles.inputDark : {})}
    />
  );
  render() {
    const {dark, style, options, ...props} = this.props;
    const OptionComponent = props => <Option {...props} dark={dark} />;
    return (
      <div
          style={{
            minWidth: `${.6 * (1 + (this.props.clearable ? 1 : 0) + options.reduce((length, option) =>
              option.label && option.label.length > length ? option.label.length : length,
              0
            ))}rem`
          }}
      >
        <ReactSelect
            inputRenderer={this.handleRenderInput}
            menuContainerStyle={Object.assign({}, styles.menuContainer, dark ? styles.menuContainerDark : {})}
            optionComponent={OptionComponent}
            options={options}
            style={Object.assign(
              {boxShadow: 'none', borderRadius: 0},
              style || styles.select, dark ? styles.selectDark : {}
            )}
            valueRenderer={this.handleRenderValue}
            {...props}
        />
      </div>
    );
  }
}

@Radium
class Option extends React.Component {
  static propTypes = {
    dark: PropTypes.bool
  };
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
      dark,
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
          style={Object.assign({}, styles.option, dark ? styles.optionDark : {})}
          title={option.title}
      >
        {children}
      </div>
    );
  }
};

const styles = {
  select: {
    border: `1px solid ${colors.border}`,
    borderRadius: 0,
    backgroundColor: colors.inputBackground
  },
  selectDark: {
    border: 0,
    backgroundColor: colors.inputBackgroundDark
  },
  option: {
    color: colors.foregroundDark,
    padding: `${minor} ${normal}`,
    cursor: 'pointer',
    flex: 1,
    [':hover']: {
      backgroundColor: color(colors.background).darken(0.05).hex()
    }
  },
  optionDark: {
    color: color(colors.foregroundLight).darken(0.1).hex(),
    [':hover']: {
      color: colors.foregroundLight,
      backgroundColor: color(colors.backgroundDark).darken(0.15).hex()
    }
  },
  value: {color: colors.foregroundDark},
  valueDark: {color: colors.gallery},
  menuContainer: Object.assign({
    borderRadius: 0,
    border: 0,
    backgroundColor: colors.backgroundLight
  }, shadow.small),
  menuContainerDark: {backgroundColor: color(colors.backgroundDark).darken(0.3).hex()},
  input: {
    margin: 0,
    background: 'none',
    border: 'none'
  },
  inputDark: {color: color(colors.foregroundLight).darken(0.1).hex()}
};
