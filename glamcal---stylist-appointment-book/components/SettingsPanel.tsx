import React, { useState, useEffect } from 'react';
import type { Settings, ThemeName, FontName, Service } from '../types';
import { CloseIcon, TrashIcon } from './Icons';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onSettingsSave: (newSettings: Settings) => void;
    services: Service[];
    onServicesChange: (newServices: Service[]) => void;
}

const THEMES: { name: ThemeName, color: string }[] = [
    { name: 'rose', color: 'bg-rose-500' },
    { name: 'lavender', color: 'bg-violet-500' },
    { name: 'mint', color: 'bg-emerald-500' },
    { name: 'ocean', color: 'bg-blue-500' },
];

const FONTS: FontName[] = ['Poppins', 'Montserrat', 'Lato', 'Playfair Display'];

const formatDateToYYYYMMDD = (date: Date): string => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, settings, onSettingsSave, services, onServicesChange }) => {
    const [currentSettings, setCurrentSettings] = useState<Settings>(settings);
    const [currentServices, setCurrentServices] = useState<Service[]>(services);
    const [newService, setNewService] = useState({ name: '', duration: 30 });
    const [newClosedRange, setNewClosedRange] = useState({ 
        start: formatDateToYYYYMMDD(new Date()), 
        end: formatDateToYYYYMMDD(new Date()) 
    });

    useEffect(() => {
        if (isOpen) {
            setCurrentSettings(settings);
            setCurrentServices(services);
        }
    }, [settings, services, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSettingsSave(currentSettings);
        onServicesChange(currentServices);
        onClose();
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setCurrentSettings(prev => ({...prev, logo: base64String}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddService = (e: React.FormEvent) => {
        e.preventDefault();
        if (newService.name && newService.duration > 0) {
            setCurrentServices(prev => [...prev, { ...newService, id: Date.now().toString() }]);
            setNewService({ name: '', duration: 30 });
        }
    };

    const handleDeleteService = (id: string) => {
        setCurrentServices(prev => prev.filter(s => s.id !== id));
    };

    const handleToggleSunday = () => {
        setCurrentSettings(prev => ({
            ...prev,
            closedDays: { ...prev.closedDays, closeOnSundays: !prev.closedDays.closeOnSundays }
        }));
    };
    
    const handleAddClosedRange = () => {
        if (newClosedRange.start && newClosedRange.end && newClosedRange.start <= newClosedRange.end) {
            const newRanges = [...(currentSettings.closedDays.customRanges || []), newClosedRange];
            newRanges.sort((a, b) => a.start.localeCompare(b.start));

            setCurrentSettings(prev => ({
                ...prev,
                closedDays: { ...prev.closedDays, customRanges: newRanges }
            }));
            const todayStr = formatDateToYYYYMMDD(new Date());
            setNewClosedRange({ start: todayStr, end: todayStr });
        }
    };

    const handleRemoveClosedRange = (indexToRemove: number) => {
         setCurrentSettings(prev => ({
            ...prev,
            closedDays: { 
                ...prev.closedDays, 
                customRanges: (prev.closedDays.customRanges || []).filter((_, index) => index !== indexToRemove) 
            }
        }));
    };

    const formatDisplayDate = (dateString: string) => {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end justify-center transition-opacity duration-300" onClick={handleSave}>
            <div
                className="bg-[rgb(var(--card))] w-full max-w-md rounded-t-2xl shadow-2xl p-6 transform transition-transform duration-300 ease-in-out translate-y-0 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[rgb(var(--card-foreground))]">Customize</h2>
                    <button onClick={handleSave} className="p-1 rounded-full text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))]">
                        <CloseIcon className="w-5 h-5"/>
                    </button>
                </div>

                <div className="space-y-8 divide-y divide-[rgb(var(--border))]">
                    {/* Appearance Section */}
                    <div className="space-y-8 pt-2">
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-2">Color Theme</label>
                            <div className="flex space-x-3">
                                {THEMES.map(theme => (
                                    <button key={theme.name} onClick={() => setCurrentSettings(s => ({...s, theme: theme.name}))} className={`w-8 h-8 rounded-full ${theme.color} ring-2 ring-offset-2 ring-offset-[rgb(var(--card))] ${currentSettings.theme === theme.name ? 'ring-[rgb(var(--ring))]' : 'ring-transparent'}`}></button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-2">Font Style</label>
                            <div className="grid grid-cols-2 gap-2">
                                {FONTS.map(font => (
                                    <button key={font} onClick={() => setCurrentSettings(s => ({...s, font}))} style={{fontFamily: `'${font}', sans-serif`}} className={`p-2 border rounded-lg text-sm ${currentSettings.font === font ? 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] border-[rgb(var(--primary))]' : 'bg-transparent border-[rgb(var(--border))]'}`}>
                                        {font}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-2">Salon Logo</label>
                            <div className="flex items-center space-x-4">
                                {currentSettings.logo && <img src={currentSettings.logo} alt="logo preview" className="w-12 h-12 rounded-full object-cover"/>}
                                <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                <label htmlFor="logo-upload" className="cursor-pointer text-sm font-semibold text-[rgb(var(--primary))] hover:opacity-80">
                                    {currentSettings.logo ? 'Change Logo' : 'Upload Logo'}
                                </label>
                                {currentSettings.logo && (
                                    <button onClick={() => setCurrentSettings(s => ({...s, logo: null}))} className="text-sm text-[rgb(var(--destructive))]">Remove</button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Closed Days Section */}
                    <div className="space-y-4 pt-8">
                        <h3 className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-2">Closed Days</h3>
                        <div className="flex items-center justify-between bg-[rgb(var(--muted)/0.5)] p-3 rounded-lg">
                            <span className="font-medium text-sm text-[rgb(var(--card-foreground))]">Close on Sundays</span>
                            <button onClick={handleToggleSunday} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${currentSettings.closedDays.closeOnSundays ? 'bg-[rgb(var(--primary))]' : 'bg-gray-300'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${currentSettings.closedDays.closeOnSundays ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[rgb(var(--muted-foreground))] mb-1">Add closed period</label>
                             <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={newClosedRange.start}
                                    onChange={e => {
                                        const newStart = e.target.value;
                                        setNewClosedRange(prev => ({ ...prev, start: newStart, end: newStart > prev.end ? newStart : prev.end }));
                                    }}
                                    className="flex-grow min-w-0 px-3 py-2 text-sm border border-[rgb(var(--border))] rounded-lg bg-transparent focus:ring-1 focus:ring-[rgb(var(--ring))]"
                                />
                                <span className="text-sm text-[rgb(var(--muted-foreground))]">to</span>
                                <input
                                    type="date"
                                    value={newClosedRange.end}
                                    min={newClosedRange.start}
                                    onChange={e => setNewClosedRange(prev => ({...prev, end: e.target.value}))}
                                    className="flex-grow min-w-0 px-3 py-2 text-sm border border-[rgb(var(--border))] rounded-lg bg-transparent focus:ring-1 focus:ring-[rgb(var(--ring))]"
                                />
                                <button type="button" onClick={handleAddClosedRange} className="flex-shrink-0 px-3 py-2 text-sm bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] rounded-lg font-semibold hover:opacity-90 transition-opacity">Add</button>
                            </div>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                             {(currentSettings.closedDays.customRanges || []).map((range, index) => (
                                <div key={index} className="flex items-center justify-between bg-[rgb(var(--muted)/0.5)] p-2 rounded-lg">
                                    <p className="font-medium text-sm text-[rgb(var(--card-foreground))]">
                                        {formatDisplayDate(range.start)}
                                        {range.start !== range.end && ` - ${formatDisplayDate(range.end)}`}
                                    </p>
                                    <button onClick={() => handleRemoveClosedRange(index)} className="p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500">
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Manage Services Section */}
                    <div className="space-y-4 pt-8">
                        <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-2">Manage Services</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {currentServices.map(service => (
                                <div key={service.id} className="flex items-center justify-between bg-[rgb(var(--muted)/0.5)] p-2 rounded-lg">
                                    <div>
                                        <p className="font-medium text-sm text-[rgb(var(--card-foreground))]">{service.name}</p>
                                        <p className="text-xs text-[rgb(var(--muted-foreground))]">{service.duration} min</p>
                                    </div>
                                    <button onClick={() => handleDeleteService(service.id)} className="p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500">
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleAddService} className="mt-3 flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Service Name"
                                value={newService.name}
                                onChange={e => setNewService(s => ({...s, name: e.target.value}))}
                                className="flex-grow min-w-0 px-3 py-2 text-sm border border-[rgb(var(--border))] rounded-lg bg-transparent focus:ring-1 focus:ring-[rgb(var(--ring))]"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Mins"
                                value={newService.duration}
                                onChange={e => setNewService(s => ({...s, duration: parseInt(e.target.value, 10) || 0}))}
                                className="w-20 px-3 py-2 text-sm border border-[rgb(var(--border))] rounded-lg bg-transparent focus:ring-1 focus:ring-[rgb(var(--ring))]"
                                required
                            />
                            <button type="submit" className="flex-shrink-0 px-3 py-2 text-sm bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] rounded-lg font-semibold hover:opacity-90 transition-opacity">Add</button>
                        </form>
                    </div>

                </div>
                <button onClick={handleSave} className="w-full bg-[rgb(var(--foreground))] text-[rgb(var(--background))] font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md mt-8">
                    Done
                </button>
            </div>
        </div>
    );
};

export default SettingsPanel;
