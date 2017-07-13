import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import colors from 'styles/colors';

@Radium
export default class Checkbox extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  };
  static defaultProps = {
    checked: false,
    disabled: false
  };
  handleClick = event => {
    event.stopPropagation();
    this.props.onClick(event);
  };
  render() {
    const {checked, disabled} = this.props;
    return (
      <i
          className="material-icons"
          onClick={this.handleClick}
          style={[
            styles.checkbox,
            disabled ? styles.disabled
            : checked ? {color: colors.default}
            : {color: colors.gray}
          ]}
      >
        {checked ? 'check_box' : 'check_box_outline_blank'}
      </i>
    );
  };
};

const styles = {
  checkbox: {
    fontSize: '20px',
    userSelect: 'none',
    cursor: 'default'
  },
  disabled: {
    color: colors.lightGray
  }
};
