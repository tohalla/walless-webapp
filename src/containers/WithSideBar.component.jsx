import React from 'react';
import PropTypes from 'prop-types';

import Padded from 'containers/Padded.component';

export default class WithSideBar extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    sideContent: PropTypes.element,
    fixedSideContent: PropTypes.bool
  };
  static defaultProps = {
    fixedSideContent: true
  };
  render() {
    const {fixedSideContent, sideContent} = this.props;
    return (
      <div className="side">
        <div className="side__side-container">
          <div className={fixedSideContent ? 'side__fixed-content' : ''}>
            {sideContent}
          </div>
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
