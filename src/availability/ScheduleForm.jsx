import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {pullAt, findIndex, get, set} from 'lodash/fp';

import colors from 'styles/colors';
import Editable from 'components/Editable';
import Form from 'components/Form';
import ShiftForm from 'availability/ShiftForm';
import DaySelect from 'availability/DaySelect';

@translate()
@Radium
export default class ScheduleForm extends React.Component {
  static propTypes = {
    schedules: PropTypes.object,
    value: PropTypes.shape(({
      day: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date)
      ]).isRequired,
      shifts: PropTypes.arrayOf(PropTypes.shape(({
        startTime: PropTypes.string,
        endTime: PropTypes.string
      })))
    })),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    submitText: PropTypes.string,
    t: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.resetState(props, state => this.state = state); // eslint-disable-line
  }
  resetState = (props, updateState = state => this.setState(state)) =>
    updateState({
      days: [].concat(get(['value', 'day'])(props) || []),
      shifts: get(['value', 'shifts'])(props) || []
    });
  handleSubmit = () => this.props.onSubmit(this.state.days.map(day => ({
    day,
    shifts: this.state.shifts
  })));
  handleDaySelect = (days, callback) => this.setState({days}, callback);
  handleAddShift = (shift, callback) =>
    this.setState({shifts: this.state.shifts.concat(shift)}, callback);
  handleEditShift = ({value, oldValue}, callback) => {
    const index = findIndex(o => oldValue.key === o.key)(this.state.shifts);
    return index === -1
      || this.setState({
        shifts: set(index)(value)(this.state.shifts)
      }, callback);
  };
  handleDeleteShift = (shift, callback) => this.setState({
    shifts: pullAt(
      findIndex(o => shift.key === o.key)(this.state.shifts)
    )(this.state.shifts)
  }, callback);
  render() {
    const {value, t, ...props} = this.props;
    const {shifts, days} = this.state;
    return (
      <Form
        {...props}
        FormComponent='div'
        isValid={Boolean(shifts.length && days.length)}
        onSubmit={this.handleSubmit}
        style={{backgroundColor: colors.white}}
      >
        {
          (value && value.day)
          || <DaySelect days={this.state.days} onSelect={this.handleDaySelect} />
        }
        <div>
          {shifts.map((shift) => (
            <Editable
              Form={ShiftForm}
              key={JSON.stringify(shift)}
              onDelete={this.handleDeleteShift}
              onEdit={this.handleEditShift}
              shifts={shifts}
              submitText={t('availability.updateShift')}
              value={shift}
            >
              <div>{`${shift.startTime} – ${shift.endTime}`}</div>
            </Editable>
          ))}
          <ShiftForm
            onSubmit={this.handleAddShift}
            shifts={shifts}
            submitText={t('availability.addShift')}
          />
        </div>
      </Form>
    );
  }
};
