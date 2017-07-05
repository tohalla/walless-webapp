import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/Button.component';

export default class Deletable extends React.Component {
  static propTypes = {
    deleteText: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string
    ]),
    onDelete: PropTypes.func.isRequired
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
      <Button
          onClick={this.handleDelete}
          plain
          style={{
            background: 'rgba(255,255,255,0.5)',
            position: 'absolute',
            top: 0,
            right: 0
          }}
          type="button"
      >
        {this.props.deleteText}
      </Button>
      {this.props.children}
    </div>
  );
}
