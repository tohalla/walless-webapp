import React from 'react';
import {findDOMNode} from 'react-dom';

export default (Component) =>
  class MDL extends React.Component {
    componentDidMount() {
      if (window.componentHandler) {
        window.componentHandler.upgradeElement(findDOMNode(this));
      }
    }
    componentWillUnmount() {
      if (window.componentHandler) {
        window.componentHandler.downgradeElements(findDOMNode(this));
      }
    }
    render = () => <Component {...this.props}/>;
  };
