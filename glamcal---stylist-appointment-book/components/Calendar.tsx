import React from 'react';

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  appointmentCounts: Map<string, number>;
  isDayClosed: (date: Date) => boolean;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, selectedDate, onDateSelect, appointmentCounts, isDayClosed }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = firstDayOfMonth.getDay();

  const today = new Date();
  const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const selectedDateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="text-center p-2"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = dateString === todayDateString;
    const isSelected = dateString === selectedDateString;
    const appointmentCount = appointmentCounts.get(dateString) || 0;
    const isClosed = isDayClosed(date);

    let dayClasses = "relative text-center py-2 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center w-10 h-10 mx-auto";
    
    if (isClosed) {
      dayClasses += " bg-gray-200 text-gray-400 cursor-not-allowed line-through";
    } else if (isSelected) {
        dayClasses += " bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] font-bold shadow-lg scale-110";
    } else if (isToday) {
        dayClasses += " bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] font-semibold";
    } else {
        if (appointmentCount > 0 && appointmentCount <= 2) {
            dayClasses += " bg-[rgb(var(--secondary)/0.3)]";
        } else if (appointmentCount > 2 && appointmentCount <= 4) {
            dayClasses += " bg-[rgb(var(--secondary)/0.6)]";
        } else if (appointmentCount > 4) {
            dayClasses += " bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))]";
        }
        dayClasses += " text-[rgb(var(--foreground))] hover:bg-[rgb(var(--muted))] cursor-pointer";
    }

    days.push(
      <div key={day} onClick={() => !isClosed && onDateSelect(date)} className="flex justify-center items-center">
        <div className={dayClasses}>
          {day}
        </div>
      </div>
    );
  }
  
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="p-4 bg-[rgb(var(--card))] rounded-b-2xl shadow-md">
        <div className="grid grid-cols-7 gap-y-2 mb-3">
            {weekdays.map(day => <div key={day} className="text-center text-xs font-medium text-[rgb(var(--muted-foreground))]">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-2">
            {days}
        </div>
    </div>
  );
};

export default Calendar;