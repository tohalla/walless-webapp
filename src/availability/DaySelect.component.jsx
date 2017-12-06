import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {pullAt, findIndex, equals} from 'lodash/fp';
import DayPicker from 'react-day-picker';

import Checkbox from 'components/Checkbox.component';
import Button from 'components/Button.component';

@translate()
@Radium
export default class DaySelect extends React.PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    days: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date)
    ]))
  };
  static defaultProps = {
    allowSpecificDates: true
  };
  state = {specific: false};
  toggleSpecific = () => {
    this.props.onSelect([]);
    this.setState({
      specific: !this.state.specific
    });
  };
  handleWeekDayClick = day => () => this.toggleDay(day);
  toggleDay = day => {
    const i = findIndex(d => equals(d)(day))(this.props.days);
    return this.props.onSelect(
      i === -1 ? this.props.days.concat(day) : pullAt(i)(this.props.days)
    );
  };
  render() {
    const {days, t} = this.props;
    const {specific} = this.state;
    const weekdays = {
      1: t('time.weekday.monday'),
      2: t('time.weekday.tuesday'),
      3: t('time.weekday.wednesday'),
      4: t('time.weekday.thursday'),
      5: t('time.weekday.friday'),
      6: t('time.weekday.saturday'),
      7: t('time.weekday.sunday')
    };
    return specific ? (
      <div>
        <DayPicker
          firstDayOfWeek={1}
          fixedWeeks
          months={[
            t('time.month.january'),
            t('time.month.february'),
            t('time.month.march'),
            t('time.month.april'),
            t('time.month.may'),
            t('time.month.june'),
            t('time.month.july'),
            t('time.month.august'),
            t('time.month.september'),
            t('time.month.october'),
            t('time.month.november'),
            t('time.month.december')
          ]}
          onDayClick={this.toggleDay}
          selectedDays={days}
          weekdaysLong={[
            t('time.weekday.monday'),
            t('time.weekday.tuesday'),
            t('time.weekday.wednesday'),
            t('time.weekday.thursday'),
            t('time.weekday.friday'),
            t('time.weekday.saturday'),
            t('time.weekday.sunday')
          ]}
          weekdaysShort={[
            t('time.weekday.mo'),
            t('time.weekday.tu'),
            t('time.weekday.we'),
            t('time.weekday.th'),
            t('time.weekday.fr'),
            t('time.weekday.sa'),
            t('time.weekday.su')
          ]}
        />
        <Button onClick={this.toggleSpecific} simple>
          {t('availability.selectWeekdays')}
        </Button>
      </div>
    ) : (
      <div>
        <div style={styles.days}>
          {Object.keys(weekdays).map(day => (
            <Checkbox
              checked={days.indexOf(day) > -1}
              disabled={Object.hasOwnProperty(day)}
              key={day}
              label={weekdays[day]}
              onClick={this.handleWeekDayClick(day)}
            />
          ))}
        </div>
        <Button onClick={this.toggleSpecific} simple>
          {t('availability.selectSpecificDates')}
        </Button>
      </div>
    );
  }
}

const styles = {
  timeRange: {
    display: 'flex',
    flexDirection: 'row'
  },
  days: {
    display: 'flex',
    flexDirection: 'row'
  }
};
