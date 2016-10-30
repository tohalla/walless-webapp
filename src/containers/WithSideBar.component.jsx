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
      <div className="side">
        <div className="side__side-container">
          <div className={fixedSideContent ? 'side__fixed-content' : ''}>
            {sideContent}
          </div>
        </div>
        <div className="side--outer-container">
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--1-col"/>
            <div className="mdl-cell mdl-cell--10-col">
              {this.props.children}
            </div>
            <div className="mdl-cell mdl-cell--1-col"/>
          </div>
        </div>
      </div>
    );
  }
}
