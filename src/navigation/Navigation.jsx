import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

@Radium
export default class Navigation extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ])
  };
  render() {
    const {style, children} = this.props;
    return (
      <div style={style}>
        {children}
      </div>
    );
  }
}
