import React from 'react';

export default class Deletable extends React.Component {
  static propTypes = {
    deleteText: React.PropTypes.oneOfType([
      React.PropTypes.node,
      React.PropTypes.string
    ]),
    onDelete: React.PropTypes.func.isRequired
  };
  static defaultProps = {
    deleteText: <i className="material-icons">{'delete'}</i>
  };
  handleDelete = event => {
    event.stopPropagation();
    this.props.onDelete();
  };
  render = () => (
    <div style={{position: 'relative', display: 'inline-block'}}>
      <button
          className="button--plain"
          onClick={this.handleDelete}
          style={{
            background: 'rgba(255,255,255,0.5)',
            position: 'absolute',
            top: 0,
            right: 0
          }}
          type="button"
      >
        {this.props.deleteText}
      </button>
      {this.props.children}
    </div>
  );
}
