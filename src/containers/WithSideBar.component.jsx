import React from 'react';
import PropTypes from 'prop-types';

import Padded from 'containers/Padded.component';

export default class WithSideBar extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    sideContent: PropTypes.element
  };
  static defaultProps = {
    fixedSideContent: true
  };
  render() {
    const {sideContent} = this.props;
    return (
      <div className="side">
        <div className="side__side-container">
          {sideContent}
        </div>
        <div className="side--outer-container">
          <Padded>
            {this.props.children}
          </Padded>
        </div>
      </div>
    );
  }
}
