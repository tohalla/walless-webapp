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
  state = {
    polyglot: null
  };
  getChildContext() {
    return {
      t: (key: String) => this.state.polyglot ? this.state.polyglot.t(key) : ''
    };
  }
  constructor(props, context) {
    super(props, context);
    if (props.polyglot.then) {
      props.polyglot.then(polyglot => this.setState({polyglot}));
    } else {
      this.setState({polyglot: props.polyglot});
    }
  }
  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.polyglot !== this.props.polyglot) {
      if (nextProps.polyglot.then) {
        nextProps.polyglot.then(polyglot => this.setState({polyglot}));
      } else {
        this.setState({polyglot: nextProps.polyglot});
      }
    }
  }
  render = () => this.props.children
}
