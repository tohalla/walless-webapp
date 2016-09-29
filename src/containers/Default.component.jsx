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
      <div className="site mdl-layout mdl-js-layout">
        <div className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">{'Ulkona'}</span>
            <MainNavigation />
            <div className="mdl-layout-spacer" />
          </div>
        </div>
        <main className="mdl-layout__content">
          <div className="flex">
            {this.props.children}
          </div>
          <footer className="mdl-mini-footer" />
        </main>
      </div>
    );
  }
}
