import React from 'react';

export default class Deletable extends React.Component {
  static propTypes = {
    onDelete: React.PropTypes.func.isRequired
  };
  handleDelete = e => {
    e.stopPropagation();
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
        <i className="material-icons">{'delete'}</i>
      </button>
      {this.props.children}
    </div>
  );
}
