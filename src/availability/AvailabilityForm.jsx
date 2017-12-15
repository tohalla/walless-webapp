import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {merge, set, omit, isEmpty} from 'lodash/fp';

import {weekdays} from 'util/time';
import Form from 'components/Form';
import {minor, content} from 'styles/spacing';
import colors from 'styles/colors';
import ScheduleForm from 'availability/ScheduleForm';
import Editable from 'components/Editable';

@translate()
@Radium
export default class AvailabilityForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    t: PropTypes.func.isRequired
  };
  state = {
    schedules: {}
  };
  handleAddSchedules = (schedules) => this.setState({
    schedules: merge(this.state.schedules)(
      schedules.reduce((prev, {day, ...schedule}) =>
        Object.assign({}, prev, {[day]: schedule})
        , {})
    )
  });
  handleEditSchedule = ({value, oldValue: {day}}) => {
    return this.state.schedules.hasOwnProperty(day)
      && this.setState({
        schedules: set(day)(value)(this.state.schedules)
      });
  };
  handleDeleteSchedule = ({day}) => this.setState({
    schedules: omit([day])(this.state.schedules)
  });
  handleSubmit = () => {};
  render() {
    const {t, ...props} = this.props;
    const {schedules} = this.state;
    const days = weekdays(t);
    return (
      <Form
        {...props}
        FormComponent='div'
        isValid={!isEmpty(schedules)}
        onSubmit={this.handleSubmit}
      >
        {Object.keys(schedules).map((schedule, index) => (
          <Editable
            Form={ScheduleForm}
            exitType='cancel'
            key={schedule}
            onDelete={this.handleDeleteSchedule}
            onEdit={this.handleEditSchedule}
            schedules={schedules}
            style={[
              styles.schedule,
              index > 0 ? {borderTop: `1px solid ${colors.backgroundLight}`} : {}
            ]}
            submitText={t('availability.updateSchedule')}
            value={{day: schedule, ...schedules[schedule]}}
          >
            <div>{isNaN(schedule) ? schedule : days[schedule]}</div>
          </Editable>
        ))}
        <ScheduleForm
          contentStyle={{padding: content}}
          onSubmit={this.handleAddSchedules}
          schedules={schedules}
          submitText={t('availability.addSchedule')}
        />
      </Form>
    );
  }
};

const styles = {
  schedule: {
    backgroundColor: colors.foregroundLight,
    justifyContent: 'space-between',
    padding: minor
  }
};
