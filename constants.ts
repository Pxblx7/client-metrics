import { KPIData, ColorPalette } from './types';

// Google Apps Script URL
export const API_URL = "https://script.google.com/macros/s/AKfycbwNdvgE2UnLAbxTB-UHr9OKb5KzY8xMBhizU0AFNQT1WwDfSxyXS1EthDKyMr6iNaq2/exec";

// Initial Fallback Data
export const INITIAL_DATA: KPIData = {
  "metadata": {
    "generated_at": new Date().toISOString(),
    "count": 0,
    "version": "3.0.0"
  },
  "kpis": []
};

// Color palettes for badges and bars (Exact from original HTML)
export const KPI_COLORS: ColorPalette[] = [
  { 
    dark: { bar: 'bg-sky-500', chip: 'bg-sky-900/50 border-sky-700 text-sky-300', text: '', border: '' },
    light: { bar: 'bg-sky-500', chip: 'bg-sky-100 border-sky-200 text-sky-800', text: '', border: '' }
  },
  { 
    dark: { bar: 'bg-emerald-500', chip: 'bg-emerald-900/50 border-emerald-700 text-emerald-300', text: '', border: '' },
    light: { bar: 'bg-emerald-500', chip: 'bg-emerald-100 border-emerald-200 text-emerald-800', text: '', border: '' }
  },
  { 
    dark: { bar: 'bg-amber-500', chip: 'bg-amber-900/50 border-amber-700 text-amber-300', text: '', border: '' },
    light: { bar: 'bg-amber-500', chip: 'bg-amber-100 border-amber-200 text-amber-800', text: '', border: '' }
  },
  { 
    dark: { bar: 'bg-indigo-500', chip: 'bg-indigo-900/50 border-indigo-700 text-indigo-300', text: '', border: '' },
    light: { bar: 'bg-indigo-500', chip: 'bg-indigo-100 border-indigo-200 text-indigo-800', text: '', border: '' }
  },
  { 
    dark: { bar: 'bg-rose-500', chip: 'bg-rose-900/50 border-rose-700 text-rose-300', text: '', border: '' },
    light: { bar: 'bg-rose-500', chip: 'bg-rose-100 border-rose-200 text-rose-800', text: '', border: '' }
  },
  { 
    dark: { bar: 'bg-cyan-500', chip: 'bg-cyan-900/50 border-cyan-700 text-cyan-300', text: '', border: '' },
    light: { bar: 'bg-cyan-500', chip: 'bg-cyan-100 border-cyan-200 text-cyan-800', text: '', border: '' }
  },
  { 
    dark: { bar: 'bg-violet-500', chip: 'bg-violet-900/50 border-violet-700 text-violet-300', text: '', border: '' },
    light: { bar: 'bg-violet-500', chip: 'bg-violet-100 border-violet-200 text-violet-800', text: '', border: '' }
  }
];

// Semaphore colors for levels (1-5) (Exact from original HTML)
export const LEVEL_COLORS = {
  dark: {
    1: { bg: 'bg-rose-600', text: 'text-rose-100' },
    2: { bg: 'bg-amber-600', text: 'text-amber-100' },
    3: { bg: 'bg-lime-600', text: 'text-lime-100' },
    4: { bg: 'bg-green-600', text: 'text-green-100' },
    5: { bg: 'bg-emerald-600', text: 'text-emerald-100' }
  },
  light: {
    1: { bg: 'bg-rose-500', text: 'text-white' },
    2: { bg: 'bg-amber-500', text: 'text-white' },
    3: { bg: 'bg-lime-500', text: 'text-white' },
    4: { bg: 'bg-green-500', text: 'text-white' },
    5: { bg: 'bg-emerald-500', text: 'text-white' }
  },
  inactive: {
    dark: 'bg-gray-800 text-gray-500',
    light: 'bg-gray-200 text-gray-500'
  }
};

// Text colors for "Logro Actual"
export const LOGRO_TEXT_COLORS = {
    dark: {
        1: 'text-rose-100', 2: 'text-amber-100', 3: 'text-lime-100', 4: 'text-green-100', 5: 'text-emerald-100'
    },
    light: {
        1: 'text-rose-600', 2: 'text-amber-600', 3: 'text-lime-600', 4: 'text-green-600', 5: 'text-emerald-600'
    }
}