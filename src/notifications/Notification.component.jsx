import {connect} from 'react-redux';

import Button from 'components/Button.component';
import {deleteNotification} from 'notifications/notification';
import colors from 'styles/colors';
import {normal} from 'styles/spacing';

@Radium
class Notification extends Component {
  static propTypes = {
    notification: PropTypes.shape({
      content: PropTypes.string
    }).isRequired,
    deleteNotification: PropTypes.func.isRequired
  };
  handleDelete = () => this.props.deleteNotification(this.props.notification);
  render() {
    const {notification} = this.props;
    return (
      <div style={styles.container}>
        <div style={[styles.indicator, styles[notification.get('type') || 'neutral']]} />
        <div style={styles.content}>
          {notification.content}
        </div>
        <div style={styles.actions}>
          <Button onClick={this.handleDelete} plain>
            <i className='material-icons'>{'close'}</i>
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(
  null, {deleteNotification}
)(Notification);

const styles = {
  container: {
    flex: '0 0 auto',
    backgroundColor: colors.background,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1px',
    border: `1px solid ${colors.border}`
  },
  indicator: {
    flex: '0 0 5px',
    alignSelf: 'stretch'
  },
  content: {
    padding: normal,
    flex: '1 0 auto'
  },
  success: {backgroundColor: colors.success},
  danger: {backgroundColor: colors.danger},
  alert: {backgroundColor: colors.alert},
  neutral: {display: 'none'},
  actions: {flex: '0 0 auto', padding: `0 ${normal}`}
};
