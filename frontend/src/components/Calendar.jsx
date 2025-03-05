import React, { useState } from 'react';
import './Calendar.css'; // Import the CSS for the calendar

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date state
  const today = new Date(); // Today's date
  const currentDay = today.getDate(); // Current day (e.g., 6 for March 6, 2023)
  const currentMonth = today.getMonth(); // Current month (e.g., 2 for March)
  const currentYear = today.getFullYear(); // Current year (e.g., 2023)

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const displayedMonth = currentDate.toLocaleString('default', { month: 'long' });
  const displayedYear = currentDate.getFullYear();
  const daysInMonth = new Date(displayedYear, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayedYear, currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(displayedYear, currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(displayedYear, currentDate.getMonth() + 1, 1));
  };

  const renderDaysOfWeek = () => {
    return daysOfWeek.map((day, index) => (
      <div key={index} className="day-of-week">
        {day}
      </div>
    ));
  };

  const renderDays = () => {
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }
    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isCurrentDay =
        i === currentDay &&
        currentDate.getMonth() === currentMonth &&
        currentDate.getFullYear() === currentYear;

      days.push(
        <div
          key={i}
          className={`day ${isCurrentDay ? 'current-day' : 'non-clickable'}`}
          onClick={isCurrentDay ? () => {
            // Add any custom logic here if needed
          } : undefined} // Only add onClick for current date
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-arrow">&lt;</button>
        <div className="month-year">{displayedMonth} {displayedYear}</div>
        <button onClick={handleNextMonth} className="nav-arrow">&gt;</button>
      </div>
      <div className="days-of-week">{renderDaysOfWeek()}</div>
      <div className="days-grid">{renderDays()}</div>
    </div>
  );
};

export default Calendar;