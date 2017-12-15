import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {pullAt, findIndex, equals} from 'lodash/fp';
import DayPicker from 'react-day-picker';

import {months, weekdaysShort, weekdays} from 'util/time';
import {minimal} from 'styles/spacing';
import Checkbox from 'components/Checkbox';
import Button from 'components/Button';

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
    return specific ? (
      <div>
        <DayPicker
          firstDayOfWeek={1}
          fixedWeeks
          months={months(t)}
          onDayClick={this.toggleDay}
          selectedDays={days}
          weekdaysLong={weekdays(t)}
          weekdaysShort={weekdaysShort(t)}
        />
        <Button onClick={this.toggleSpecific} simple>
          {t('availability.selectWeekdays')}
        </Button>
      </div>
    ) : (
      <div>
        <div style={styles.days}>
          {weekdays(t).map((day, index) => (
            <Checkbox
              checked={days.indexOf(index) > -1}
              key={day}
              label={day}
              onClick={this.handleWeekDayClick(index)}
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
    flexDirection: 'row',
    margin: `${minimal} 0`
  }
};
