// @flow
import React from 'react';

export default class TranslationWrapper extends React.Component {
  static childContextTypes = {
    t: React.PropTypes.func.isRequired
  };
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]),
    polyglot: React.PropTypes.object.isRequired
  };
  constructor(props: Object, context: Object) {
    super(props, context);
    if (props.polyglot.then) {
      props.polyglot.then(polyglot =>
        this.setState({polyglot})
      );
    }
  }
  state = {
    polyglot: null
  };
  getChildContext() {
    return {
      t: (key: string, interpolarisations: Object) =>
        this.state.polyglot ?
          this.state.polyglot.t(key, interpolarisations) : ''
    };
  }
  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.polyglot !== this.props.polyglot) {
      if (nextProps.polyglot.then) {
        nextProps.polyglot.then(polyglot =>
          this.setState({polyglot})
        );
      }
    }
  }
  shouldComponentUpdate = (newProps: Object, newState: Object, newContext: Object) => {
    return newState.polyglot && newState.polyglot !== this.state.polyglot;
  }
  render = () => this.props.children
}
