import React from 'react';

export default class WithSideBar extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]),
    sideContent: React.PropTypes.element,
    fixedSideContent: React.PropTypes.bool
  };
  static defaultProps = {
    fixedSideContent: true
  };
  render() {
    const {fixedSideContent, sideContent} = this.props;
    return (
      <div className="flex">
        <div className="side-container">
          <div className={fixedSideContent ? 'side-fixed' : ''}>
            {sideContent}
          </div>
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
