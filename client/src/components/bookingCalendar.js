// fetch('/api/bookings/getBookingsInFuture'), don't use hooks
import useBookingsInFuture from '../hooks/useBookingsInFuture';
import { useAuthContext } from '../hooks/useAuthContext';
// I need to confirm the selected date and time in my bookingCalendar.js by clicking on the box in the table
// Then pass this value to the parent component of bookingCalendar.js pages/booking.js
import { useState } from 'react'; // import useState

const BookingCalendar = ({ onSetDateTime }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const { user } = useAuthContext();

  // use isLoading from parent component to rerender the component

  let futureBookings = useBookingsInFuture();
  // create array of 7 days from today to 7 days
  // content include date and time
  // create init array, every item is an object with date and time, date is string, time is array
  const today = new Date();
  const week = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    // convert date to string "2023-12-04T00:00:00.000Z"

    const dateString = date.toISOString().slice(0, 10);

    const timeArray = []; // create empty array for time
    // init timeArray with 8:00, 9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
    for (let j = 8; j <= 16; j++) {
      // if j < 10, add 0 in front of j
      if (j < 10) {
        timeArray.push(`0${j}:00`);
      } else {
        timeArray.push(`${j}:00`);
      }
    }
    week.push({ date: dateString, time: timeArray });
  }

  // check bookings is an empty array or not
  return (
    <div className="p-5">
      {/* {JSON.stringify(futureBookings)} */}
      <table className="table table-bordered">
        <thead className="table-secondary">
          <tr style={{ textAlign: 'center', fontSize: '12px' }}>
            <th>Date</th>
            {week.map((day, index) => (
              <th key={index}>{day.date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {week[0].time.map((timeSlot, index) => (
            <tr key={index}>
              <td>{timeSlot}</td>
              {/* // use week array's timeSlot and date to match every item in
              futureBookings date and time */}
              {week.map((day, index) => (
                <td
                  onClick={(e) => {
                    // check this box background color
                    if (e.target.style.backgroundColor === 'transparent') {
                      setSelectedDate(day.date);
                      setSelectedTime(timeSlot);
                      e.target.style.backgroundColor = '#0099cc';
                      onSetDateTime(day.date, timeSlot);
                    } else {
                      setSelectedDate('');
                      setSelectedTime('');
                      onSetDateTime('', '');
                    }
                  }}
                  key={index}
                  style={{
                    // // check bookings is an empty array or not
                    // // change the color to your desired color
                    backgroundColor:
                      futureBookings &&
                      futureBookings.some(
                        (booking) =>
                          booking.date.slice(0, 10) === day.date &&
                          (booking.time === timeSlot ||
                            booking.time.slice(0, 2) === timeSlot.slice(0, 2))
                      )
                        ? '#ca0000' // change the color to your desired color
                        : day.date === selectedDate && timeSlot === selectedTime
                        ? '#0099cc'
                        : 'transparent',
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="calendar-status">
        <span className="available-time-circle"></span>
        <span>available</span>

        <span className="disabled-time-circle"></span>
        <span>disabled</span>

        <span className="selected-time-circle"></span>
        <span>selected</span>
      </p>
      {futureBookings &&
        futureBookings.filter((booking) => booking.email === user.email)
          .length > 0 && (
          <p
            style={{
              textAlign: 'center',
              marginTop: '10px',
              marginBottom: '10px',
              border: '1px solid grey',
            }}
          >
            My next week's booking:
            {futureBookings &&
              futureBookings
                .filter((booking) => booking.email === user.email)
                .map((booking) => (
                  <li key={booking.date} style={{ listStyle: 'none' }}>
                    <i
                      className="fa-solid fa-calendar-days"
                      style={{ marginRight: '5px' }}
                    ></i>
                    {booking.date.slice(0, 10)} {booking.time}
                  </li>
                ))}
          </p>
        )}
    </div>
  );
};

export default BookingCalendar;
