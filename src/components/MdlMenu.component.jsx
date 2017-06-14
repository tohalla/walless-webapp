import React from 'react';
import PropTypes from 'prop-types';

import mdl from 'components/mdl';

class MdlMenu extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };
  render() {
    const {children, ...props} = this.props;
    return (
      <ul className="mdl-menu mdl-js-menu" {...props}>
        {children}
      </ul>
    );
  }
}

export default mdl(MdlMenu);
