import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Button from 'components/Button.component';

@Radium
export default class Editable extends React.Component {
  static propTypes = {
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    Form: PropTypes.func
  };
  state = {edit: false};
  toggleEdit = () => this.setState({
    edit: typeof this.props.onEdit === 'function' && !this.state.edit
  });
  handleEdit = option => {
    if (typeof this.props.onEdit === 'function') {
      this.setState({edit: false});
      this.props.onEdit(option, this.props.option);
    }
  };
  handleDelete = () => typeof this.props.onDelete === 'function' &&
    this.props.onDelete(this.props.option);
  render() {
    const {onEdit, onDelete, children, Form, ...props} = this.props;
    return this.state.edit ? (
      <Form
          {...props}
          forceOpen
          onClose={this.toggleEdit}
          onSubmit={this.handleEdit}
      />
    ) : (
      <div style={styles.container}>
        {children}
        {typeof onEdit === 'function' &&
          <Button onClick={this.toggleEdit} plain>
            <i className="material-icons">{'edit'}</i>
          </Button>
        }
        {typeof onDelete === 'function' &&
          <Button onClick={this.handleDelete} plain>
            <i className="material-icons">{'delete'}</i>
          </Button>
        }
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
};
