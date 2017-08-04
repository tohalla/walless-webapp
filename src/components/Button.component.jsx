import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import color from 'color';

import {normal, minor, minimal} from 'styles/spacing';
import colors from 'styles/colors';
import shadow from 'styles/shadow';
import Loading from 'components/Loading.component';

@Radium
export default class Button extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    type: PropTypes.string,
    plain: PropTypes.bool,
    accent: PropTypes.bool,
    disabled: PropTypes.bool
  };
  static defaultProps = {
    type: 'button'
  }
  handleClick = event => {
    event.stopPropagation();
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event);
    }
  }
  render() {
    const {
      plain,
      accent,
      children,
      disabled,
      loading,
      style,
      ...props
    } = this.props;
    return (
      <button
          {...props}
          disabled={loading || disabled}
          onClick={this.handleClick}
          style={[].concat(styles.button,
            plain ? [styles.plain, disabled ? {opacity: .5} : {opacity: 1}]
            : [
              accent ? styles.accent : styles.color,
              loading ?
                styles.buttonLoading
              : disabled ?
                styles.disabled
              : shadow.small
            ],
            style
          )}
      >
        {loading ?
          <Loading color={colors.foregroundLight} small style={styles.loading}/>
        : null}
        <div
            style={[].concat(
              plain ? styles.plainText : [],
              loading ? {opacity: 0, color: 'transparent'} : []
            )}
        >
          {children}
        </div>
      </button>
    );
  }
}

const styles = {
  button: {
    flex: '0 0 auto',
    textTransform: 'uppercase',
    cursor: 'pointer',
    margin: minor,
    fontSize: '0.9rem',
    border: 0,
    borderRadius: 0,
    display: 'flex',
    padding: `${minor} ${normal}`,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.foregroundLight,
    position: 'relative',
    userSelect: 'none'
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
    [':hover']: {
      backgroundColor: colors.default
    },
    backgroundColor: color(colors.default).darken(.1).hex()
  },
  disabled: {
    cursor: 'initial',
    backgroundColor: colors.disabled,
    opacity: .5,
    [':hover']: {
      opacity: .5
    }
  },
  accent: {
    [':hover']: {
      backgroundColor: colors.accent
    },
    backgroundColor: color(colors.accent).darken(.1).hex()
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
    opacity: .8,
    [':hover']: {opacity: 1}
  }
};
