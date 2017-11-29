import {connect} from 'react-redux';
import {get} from 'lodash/fp';

import {minor} from 'styles/spacing';
import TimeInput from 'components/TimeInput.component';
import Form from 'components/Form.component';

@Radium
class ShiftForm extends PureComponent {
  static propTypes = {
    value: PropTypes.shape(({
      startTime: PropTypes.string,
      endTime: PropTypes.string
    })),
    onSubmit: PropTypes.func,
    submitText: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.resetState(props, state => this.state = state); // eslint-disable-line
  }
  handleSubmit = () => {
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.state, this.props.shift);
      this.resetState(this.props);
    }
  };
  handleFromChange = value => this.setState({startTime: value});
  handleToChange = value => this.setState({endTime: value});
  resetState = (props, updateState = state => this.setState(state)) =>
    updateState({
      key: get(['value', 'key'])(props)
        || Math.random().toString(36).substring(2),
      startTime: get(['value', 'startTime'])(props),
      endTime: get(['value', 'endTime'])(props)
    });
  render() {
    const {t, ...props} = this.props;
    return (
      <Form
          {...props}
          FormComponent="div"
          contentStyle={styles.container}
          onSubmit={this.handleSubmit}
          style={styles.container}
      >
        <TimeInput
            label={t('time.timeFrom')}
            labelLocation="left"
            onChange={this.handleFromChange}
            required
            style={{paddingRight: minor}}
            value={this.state.startTime}
        />
        <TimeInput
            label={t('time.timeTo')}
            labelLocation="left"
            onChange={this.handleToChange}
            required
            value={this.state.endTime}
        />
      </Form>
    );
  }
}

export default connect(state => ({t: state.util.translation.t}))(ShiftForm);

const styles = {
  container: {
    flex: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
};
