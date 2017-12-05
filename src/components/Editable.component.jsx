import Button from 'components/Button.component';

@Radium
export default class Editable extends PureComponent {
  static propTypes = {
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    Form: PropTypes.func,
    value: PropTypes.object,
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    children: PropTypes.node,
    exitType: PropTypes.oneOf(['cancel', 'close'])
  };
  static defaultProps = {
    exitType: 'close'
  };
  state = {edit: false};
  toggleEdit = () => this.setState({
    edit: typeof this.props.onEdit === 'function' && !this.state.edit
  });
  handleEdit = (value, callback) => {
    if (typeof this.props.onEdit === 'function') {
      this.setState({edit: false});
      this.props.onEdit({value, oldValue: this.props.value}, callback);
    }
  };
  handleDelete = () => typeof this.props.onDelete === 'function' &&
    this.props.onDelete(this.props.value);
  render() {
    const {
      onEdit,
      exitType,
      style,
      onDelete,
      children,
      Form,
      ...props
    } = this.props;
    return this.state.edit ? (
      <Form
        {...props}
        forceOpen
        onCancel={exitType === 'cancel' ? this.toggleEdit : undefined}
        onClose={exitType === 'close' ? this.toggleEdit : undefined}
        onSubmit={this.handleEdit}
      />
    ) : (
      <div style={[styles.container, style]}>
        {children}
        <div style={styles.actions}>
          {typeof onEdit === 'function' &&
            <Button onClick={this.toggleEdit} plain>
              <i className='material-icons'>{'edit'}</i>
            </Button>
          }
          {typeof onDelete === 'function' &&
            <Button onClick={this.handleDelete} plain>
              <i className='material-icons'>{'delete'}</i>
            </Button>
          }
        </div>
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
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
};
