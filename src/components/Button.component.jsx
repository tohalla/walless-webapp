import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import {normal, minor, minimal} from 'styles/spacing';
import colors from 'styles/colors';
import Loading from 'components/Loading.component';

@Radium
export default class Button extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    type: PropTypes.string,
    plain: PropTypes.bool,
    accent: PropTypes.bool,
    simple: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ])
  };
  static defaultProps = {
    type: 'button'
  };
  handleClick = event => {
    event.stopPropagation();
    if (typeof this.props.onClick === 'function') this.props.onClick(event);
  };
  render() {
    const {
      plain,
      accent,
      children,
      disabled,
      loading,
      style,
      simple,
      ...props
    } = this.props;
    return (
      <button
        {...props}
        disabled={loading || disabled}
        onClick={this.handleClick}
        style={[].concat(styles.button,
          plain ? [styles.plain, disabled ? {opacity: 0.5} : {opacity: 1}]
            : simple ? [styles.simple, disabled ? {opacity: 0.5} : {opacity: 1}]
              : [
                accent ? styles.accent : styles.color,
                loading ?
                  styles.buttonLoading
                  : disabled ?
                    styles.disabled
                    : styles.shadow
              ],
          style
        )}
      >
        {loading ?
          <Fragment>
            <Loading color={colors.foregroundLight} small style={styles.loading} />
            <div style={{opacity: 0, color: 'transparent'}}>
              {children}
            </div>
          </Fragment>
          : plain && typeof children === 'string' ?
            <span style={styles.plainText}>{children}</span>
            : children
        }
      </button>
    );
  }
}

const styles = {
  shadow: {
    boxShadow: '0 3px 6px rgba(0,0,0,0.14), 0 2px 4px rgba(0,0,0,0.2)',
    [':hover']: {
      boxShadow: '0 2px 4px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.2)'
    }
  },
  button: {
    borderRadius: 0,
    flex: '0 0 auto',
    textTransform: 'uppercase',
    cursor: 'pointer',
    margin: minor,
    fontSize: '0.9rem',
    border: 'none',
    background: 'none',
    display: 'flex',
    padding: `${minor} ${normal}`,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.foregroundLight,
    position: 'relative',
    userSelect: 'none'
  },
  simple: {
    [':hover']: {color: colors.neutralDark},
    color: colors.neutral,
    background: 'none',
    boxShadow: 'none'
  },
  buttonLoading: {
    cursor: 'initial',
    boxShadow: 'none'
  },
  loading: {
    position: 'absolute',
    opaticy: 1,
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  color: {
    background: colors.defaultDarken,
    [':hover']: {
      background: colors.default
    }
  },
  accent: {
    background: colors.accentDarken,
    [':hover']: {
      background: colors.accent
    }
  },
  disabled: {
    cursor: 'initial',
    background: colors.disabled,
    opacity: 0.5,
    [':hover']: {
      opacity: 0.5
    }
  },
  plain: {
    textTransform: 'none',
    margin: 0,
    fontSize: 'initial',
    cursor: 'pointer',
    background: 'none',
    padding: `0 ${minimal}`,
    color: colors.foregroundDark
  },
  plainText: {
    textDecoration: 'underline',
    opacity: 0.8,
    [':hover']: {opacity: 1}
  }
};
