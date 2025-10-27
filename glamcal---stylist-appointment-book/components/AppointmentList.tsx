import React from 'react';
import type { Appointment } from '../types';
import { ClockIcon, UserIcon, ScissorsIcon, TrashIcon, PencilIcon, CalendarPlusIcon } from './Icons';

interface AppointmentListProps {
  selectedDate: Date;
  appointments: Appointment[];
  onDeleteAppointment: (id: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onBookFollowUp: (appointment: Appointment) => void;
  isDayClosed: (date: Date) => boolean;
}

const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const AppointmentList: React.FC<AppointmentListProps> = ({ selectedDate, appointments, onDeleteAppointment, onEditAppointment, onBookFollowUp, isDayClosed }) => {
  const selectedDateString = formatDateToYYYYMMDD(selectedDate);
  const dailyAppointments = appointments
    .filter(app => app.date === selectedDateString)
    .sort((a, b) => a.time.localeCompare(b.time));
  
  const formattedDate = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  const isClosed = isDayClosed(selectedDate);

  return (
    <div className="p-4 flex-grow overflow-y-auto">
        <h2 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-4">Bookings for {formattedDate}</h2>
        {isClosed ? (
             <div className="text-center py-10 px-4">
                <p className="text-[rgb(var(--muted-foreground))] font-semibold">The salon is closed today.</p>
                <p className="text-sm text-[rgb(var(--muted-foreground))] opacity-70">Enjoy your day off! ☀️</p>
            </div>
        ) : dailyAppointments.length > 0 ? (
            <div className="space-y-4">
                {dailyAppointments.map((app) => (
                    <div key={app.id} className="bg-[rgb(var(--card))] p-4 rounded-xl shadow-sm border border-[rgb(var(--border))] transition-shadow duration-300 group hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div className="flex-grow">
                                <div className="flex items-center space-x-2 text-[rgb(var(--card-foreground))] mb-3">
                                    <ClockIcon className="w-5 h-5 text-[rgb(var(--primary))]" />
                                    <span className="font-bold text-lg">{app.time}</span>
                                </div>
                                <div className="space-y-2 text-sm text-[rgb(var(--muted-foreground))]">
                                    <div className="flex items-center space-x-3">
                                        <UserIcon className="w-5 h-5 text-[rgb(var(--accent))]" />
                                        <span>{app.clientName}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <ScissorsIcon className="w-5 h-5 text-[rgb(var(--accent))]" />
                                        <span>{app.service}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <ClockIcon className="w-5 h-5 text-[rgb(var(--accent))]" />
                                        <span>{app.duration} min</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={() => onEditAppointment(app)}
                                    className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                    aria-label="Edit appointment"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                 <button
                                    onClick={() => onBookFollowUp(app)}
                                    className="p-2 rounded-full text-gray-400 hover:bg-blue-100 hover:text-blue-500 transition-colors"
                                    aria-label="Book follow-up"
                                >
                                    <CalendarPlusIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => onDeleteAppointment(app.id)}
                                    className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                                    aria-label="Delete appointment"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-10 px-4">
                <p className="text-[rgb(var(--muted-foreground))]">No bookings for today.</p>
                <p className="text-sm text-[rgb(var(--muted-foreground))] opacity-70">Time for a coffee! ☕️</p>
            </div>
        )}
    </div>
  );
};

export default AppointmentList;