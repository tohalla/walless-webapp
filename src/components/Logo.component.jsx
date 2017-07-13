import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Walless from 'images/walless.svg';

@Radium
export default class Logo extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
  };
  static defaultProps = {
    width: 30,
    height: 30
  }
  render() {
    return (
      <Walless {...this.props}/>
    );
  }
};
