import DatePicker from 'react-datepicker';
import { getMonth, getYear } from 'date-fns';
import range from 'lodash/range';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '~/icons/Icons';

const Dateinput = ({ field }) => {
  const years = range(1990, getYear(new Date()) + 1, 1);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return (
    <DatePicker
      selected={field.value}
      onChange={(date) => field.onChange(date)}
      showIcon
      icon={<CalendarIcon />}
      isClearable
      //@ts-ignore
      toggleCalendarOnIconClick
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div
          style={{
            margin: 10,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            {'<'}
          </button>
          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(value)}
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={months[getMonth(date)]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            {'>'}
          </button>
        </div>
      )}
    />
  );
};

export default Dateinput;
