import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, PaletteIcon } from './Icons';
import type { Settings } from '../types';

interface HeaderProps {
    currentDate: Date;
    settings: Settings;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onAddAppointment: () => void;
    onOpenSettings: () => void;
    disabledAdd: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentDate, settings, onPrevMonth, onNextMonth, onAddAppointment, onOpenSettings, disabledAdd }) => {
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <header className="flex items-center justify-between p-4 bg-[rgb(var(--card)/0.8)] backdrop-blur-sm sticky top-0 z-10 border-b border-[rgb(var(--border))]">
            <div className="flex items-center gap-3">
                {settings.logo ? (
                    <img src={settings.logo} alt="Salon Logo" className="h-8 w-8 object-cover rounded-full"/>
                ) : null}
                <h1 className="text-xl font-bold text-[rgb(var(--card-foreground))]">{monthYear}</h1>
            </div>
            <div className="flex items-center space-x-1">
                <button onClick={onPrevMonth} className="p-2 rounded-full text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] transition-colors">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button onClick={onNextMonth} className="p-2 rounded-full text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] transition-colors">
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={onOpenSettings} 
                    className="p-2 rounded-full text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] transition-colors"
                    aria-label="Customize appearance"
                >
                    <PaletteIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={onAddAppointment} 
                    disabled={disabledAdd}
                    className={`p-2 rounded-full bg-[rgb(var(--foreground))] text-[rgb(var(--background))] transition-opacity shadow-md ${disabledAdd ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
                    aria-label="Add new appointment"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default Header;