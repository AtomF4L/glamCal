import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Appointment, Settings, Service } from './types';
import Header from './components/Header';
import Calendar from './components/Calendar';
import AppointmentList from './components/AppointmentList';
import BookingForm from './components/BookingForm';
import SettingsPanel from './components/SettingsPanel';
import ConfirmationModal from './components/ConfirmationModal';

const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getInitialAppointments = (): Appointment[] => {
    try {
        const saved = localStorage.getItem('glamcal_appointments');
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error("Failed to load appointments from localStorage", e);
    }
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    return [
        { id: '1', date: formatDateToYYYYMMDD(today), time: '10:00', clientName: 'Jessica L.', service: 'Balayage', duration: 180 },
        { id: '2', date: formatDateToYYYYMMDD(today), time: '13:30', clientName: 'Sarah K.', service: 'Cut & Style', duration: 60 },
        { id: '3', date: formatDateToYYYYMMDD(tomorrow), time: '11:00', clientName: 'Emily R.', service: 'Full Head Highlights', duration: 150 },
        { id: '4', date: formatDateToYYYYMMDD(today), time: '09:00', clientName: 'Chloe B.', service: 'Wash and Blowdry', duration: 45 }
    ];
};

const getInitialSettings = (): Settings => {
    try {
        const saved = localStorage.getItem('glamcal_settings');
        if (saved) {
            const parsed = JSON.parse(saved);
             // Migration logic for old structure
            if (parsed.closedDays && parsed.closedDays.customDates && Array.isArray(parsed.closedDays.customDates)) {
                parsed.closedDays.customRanges = parsed.closedDays.customDates.map((date: string) => ({ start: date, end: date }));
                delete parsed.closedDays.customDates;
            }
             // Ensure customRanges is an array if it doesn't exist
            if (parsed.closedDays && !parsed.closedDays.customRanges) {
                parsed.closedDays.customRanges = [];
            }
            return parsed;
        }
    } catch (e) {
        console.error("Failed to load settings from localStorage", e);
    }
    return { 
        theme: 'rose', 
        font: 'Poppins', 
        logo: null,
        closedDays: {
            closeOnSundays: true,
            customRanges: [],
        }
    };
}

const getInitialServices = (): Service[] => {
    try {
        const saved = localStorage.getItem('glamcal_services');
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error("Failed to load services from localStorage", e);
    }
    return [
        { id: '1', name: 'Cut & Style', duration: 60 },
        { id: '2', name: 'Balayage', duration: 180 },
        { id: '3', name: 'Full Head Highlights', duration: 150 },
        { id: '4', name: 'Wash and Blowdry', duration: 45 },
        { id: '5', name: 'Root Touch-up', duration: 90 },
    ];
};


const App: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>(getInitialAppointments());
    const [settings, setSettings] = useState<Settings>(getInitialSettings());
    const [services, setServices] = useState<Service[]>(getInitialServices());
    const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [deletingAppointmentId, setDeletingAppointmentId] = useState<string | null>(null);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

    useEffect(() => {
        localStorage.setItem('glamcal_appointments', JSON.stringify(appointments));
    }, [appointments]);

    useEffect(() => {
        localStorage.setItem('glamcal_settings', JSON.stringify(settings));
        document.documentElement.dataset.theme = settings.theme;
        document.body.style.fontFamily = `'${settings.font}', sans-serif`;
    }, [settings]);

    useEffect(() => {
        localStorage.setItem('glamcal_services', JSON.stringify(services));
    }, [services]);

    const isDayClosed = useCallback((date: Date): boolean => {
        if (settings.closedDays.closeOnSundays && date.getDay() === 0) {
            return true;
        }
        
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0); // Normalize date to avoid time issues

        if (!settings.closedDays.customRanges) return false;

        for (const range of settings.closedDays.customRanges) {
            const startDate = new Date(range.start + 'T00:00:00');
            const endDate = new Date(range.end + 'T00:00:00');
            if (checkDate >= startDate && checkDate <= endDate) {
                return true;
            }
        }
        return false;
    }, [settings.closedDays]);

    useEffect(() => {
        // If the initially selected date is a closed day, find the next available day
        if (isDayClosed(selectedDate)) {
            let nextAvailableDate = new Date(selectedDate);
            while (isDayClosed(nextAvailableDate)) {
                nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
            }
            setSelectedDate(nextAvailableDate);
        }
    }, []); // Run only on mount


    const appointmentCounts = useMemo(() => {
        const counts = new Map<string, number>();
        for (const app of appointments) {
            counts.set(app.date, (counts.get(app.date) || 0) + 1);
        }
        return counts;
    }, [appointments]);

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };
    
    const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id'>, id: string | null) => {
        if (id) {
            // Editing existing appointment
            setAppointments(prev => prev.map(app => app.id === id ? { ...appointmentData, id } : app));
        } else {
            // Creating new appointment
            setAppointments(prev => [...prev, { ...appointmentData, id: Date.now().toString() }]);
        }
        setIsBookingFormOpen(false);
        setEditingAppointment(null);
    };

    const handleDeleteAppointment = (id: string) => {
        setDeletingAppointmentId(id);
    };

    const handleStartEdit = (appointment: Appointment) => {
        setEditingAppointment(appointment);
        setIsBookingFormOpen(true);
    };

    const handleBookFollowUp = (appointment: Appointment) => {
        const followUpDate = new Date(appointment.date);
        followUpDate.setDate(followUpDate.getDate() + 28); // 4 weeks later

        // Find the next available day if the suggested follow-up date is a closed day
        while(isDayClosed(followUpDate)) {
            followUpDate.setDate(followUpDate.getDate() + 1);
        }
        
        setSelectedDate(followUpDate);
        setCurrentDate(followUpDate);
        
        // Pre-fill the form, but without an ID so it's treated as a new appointment
        setEditingAppointment({
            ...appointment,
            id: '', 
            date: formatDateToYYYYMMDD(followUpDate),
        });
        setIsBookingFormOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingAppointmentId) {
            setAppointments(prev => prev.filter(app => app.id !== deletingAppointmentId));
            setDeletingAppointmentId(null);
        }
    };

    const handleCloseBookingForm = () => {
        setIsBookingFormOpen(false);
        setEditingAppointment(null);
    }
    
    const isSelectedDateClosed = isDayClosed(selectedDate);

    return (
        <div className="bg-[rgb(var(--background))] h-screen max-h-screen w-full max-w-md mx-auto flex flex-col shadow-2xl">
            <Header
                currentDate={currentDate}
                settings={settings}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onAddAppointment={() => setIsBookingFormOpen(true)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                disabledAdd={isSelectedDateClosed}
            />
            <main className="flex-grow flex flex-col overflow-y-hidden">
                <Calendar 
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    appointmentCounts={appointmentCounts}
                    isDayClosed={isDayClosed}
                />
                <AppointmentList 
                    selectedDate={selectedDate} 
                    appointments={appointments}
                    onDeleteAppointment={handleDeleteAppointment}
                    onEditAppointment={handleStartEdit}
                    onBookFollowUp={handleBookFollowUp}
                    isDayClosed={isDayClosed}
                />
            </main>
            <BookingForm 
                isOpen={isBookingFormOpen}
                onClose={handleCloseBookingForm}
                onSave={handleSaveAppointment}
                selectedDate={selectedDate}
                services={services}
                appointmentToEdit={editingAppointment}
            />
            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                onSettingsSave={setSettings}
                services={services}
                onServicesChange={setServices}
            />
            <ConfirmationModal
                isOpen={!!deletingAppointmentId}
                onClose={() => setDeletingAppointmentId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Appointment"
                message="Are you sure you want to delete this appointment? This action cannot be undone."
            />
        </div>
    );
};

export default App;