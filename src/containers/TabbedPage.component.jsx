import React from 'react';
import {Link} from 'react-router';

export default class TabbedPage extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  }
  render() {
    return (
      <div className="flex">
        <div className="side-container">
          <nav className="side-navigation">
            <Link className="side-navigation__link" to="">{'link1'}</Link>
            <Link className="side-navigation__link" to="">{'link2'}</Link>
            <Link className="side-navigation__link" to="">{'link3'}</Link>
          </nav>
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
