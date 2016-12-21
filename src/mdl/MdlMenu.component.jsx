import React from 'react';

import mdl from 'mdl/mdl';

class MdlMenu extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
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
