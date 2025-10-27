export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  clientName: string;
  service: string;
  duration: number; // in minutes
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
}

export type ThemeName = 'rose' | 'lavender' | 'mint' | 'ocean';
export type FontName = 'Poppins' | 'Montserrat' | 'Lato' | 'Playfair Display';

export interface ClosedDateRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
}

export interface ClosedDaysConfig {
  closeOnSundays: boolean;
  customRanges: ClosedDateRange[];
}

export interface Settings {
    theme: ThemeName;
    font: FontName;
    logo: string | null; // base64 string
    closedDays: ClosedDaysConfig;
}
