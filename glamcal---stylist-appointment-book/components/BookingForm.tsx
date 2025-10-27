import React, { useState, useEffect } from 'react';
import type { Appointment, Service } from '../types';
import { CloseIcon } from './Icons';

interface BookingFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (appointment: Omit<Appointment, 'id'>, id: string | null) => void;
    selectedDate: Date;
    services: Service[];
    appointmentToEdit: Appointment | null;
}

const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const BookingForm: React.FC<BookingFormProps> = ({ isOpen, onClose, onSave, selectedDate, services, appointmentToEdit }) => {
    const [clientName, setClientName] = useState('');
    const [time, setTime] = useState('09:00');
    const [selectedServiceId, setSelectedServiceId] = useState(services.length > 0 ? services[0].id : '');

    useEffect(() => {
        if (isOpen) {
            if (appointmentToEdit) {
                setClientName(appointmentToEdit.clientName);
                setTime(appointmentToEdit.time);
                const service = services.find(s => s.name === appointmentToEdit.service);
                setSelectedServiceId(service ? service.id : (services.length > 0 ? services[0].id : ''));
            } else {
                setClientName('');
                setTime('09:00');
                if (services.length > 0) {
                  setSelectedServiceId(services[0].id);
                }
            }
        }
    }, [isOpen, appointmentToEdit, services]);
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedService = services.find(s => s.id === selectedServiceId);
        if(!clientName || !time || !selectedService) {
            alert("Please fill all fields and select a service.");
            return;
        }
        
        const appointmentData = {
            date: formatDateToYYYYMMDD(appointmentToEdit?.id ? new Date(appointmentToEdit.date + 'T00:00:00') : selectedDate),
            time,
            clientName,
            service: selectedService.name,
            duration: selectedService.duration,
        };

        onSave(appointmentData, appointmentToEdit ? appointmentToEdit.id : null);
    };

    const formTitle = appointmentToEdit?.id ? 'Edit Appointment' : 'New Appointment';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end justify-center transition-opacity duration-300" onClick={onClose}>
            <div 
                className="bg-[rgb(var(--card))] w-full max-w-md rounded-t-2xl shadow-2xl p-6 transform transition-transform duration-300 ease-in-out translate-y-0"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[rgb(var(--card-foreground))]">{formTitle}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))]">
                        <CloseIcon className="w-5 h-5"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">Client Name</label>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-[rgb(var(--ring))] focus:border-[rgb(var(--ring))] bg-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">Service</label>
                        <select
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                            className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-[rgb(var(--ring))] focus:border-[rgb(var(--ring))] bg-transparent appearance-none"
                            required
                        >
                            {services.length === 0 ? (
                                <option value="" disabled>Please add services in settings</option>
                            ) : (
                                services.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.name} ({service.duration} min)
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-[rgb(var(--ring))] focus:border-[rgb(var(--ring))] bg-transparent"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-[rgb(var(--foreground))] text-[rgb(var(--background))] font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md mt-2">
                        Save Appointment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;