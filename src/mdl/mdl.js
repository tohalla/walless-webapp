import React from 'react';
import {findDOMNode} from 'react-dom';

export default (Component) =>
  class MDL extends React.Component {
    componentDidMount() {
      window.componentHandler.upgradeElement(findDOMNode(this));
    }
    componentWillUnmount() {
      window.componentHandler.downgradeElements(findDOMNode(this));
    }
    render = () => <Component {...this.props}/>;
  };
