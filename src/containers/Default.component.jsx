import React from 'react';

import MainNavigation from '../navigation/MainNavigation.component';

export default class Default extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  }
  render() {
    return (
      <div className="mdl-layout">
        <div className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <MainNavigation />
          </div>
        </div>
        <main className="mdl-layout__content">
            {this.props.children}
        </main>
        <footer className="mdl-mini-footer" />
      </div>
    );
  }
}
