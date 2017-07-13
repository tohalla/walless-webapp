import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import LoadingIcon from 'images/loading.svg';
import colors from 'styles/colors';

@Radium
export default class Loading extends React.Component {
  static propTypes = {
    color: PropTypes.oneOf(Object.values(colors)),
    small: PropTypes.bool,
    loading: PropTypes.bool
  };
  static defaultProps = {
    color: colors.foregroundDark,
    loading: true
  };
  render() {
    const {color, small, loading, style, ...props} = this.props;
    const size = small ? {width: '1rem', height: '1rem'} : {width: 60, height: 60};
    return loading ? (
      <div
          style={[
            {
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }
          ]}
      >
        <LoadingIcon
            style={{fill: color, opacity: .6, ...style, ...size}}
            {...props}
        />
      </div>
    ) : null;
  }
};
