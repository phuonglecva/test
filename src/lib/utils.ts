import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';
import { translate } from './i18n';
import type { AppLanguage } from './i18n';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
}

export function formatDateLabel(date: Date, language: AppLanguage = 'vi') {
  return format(date, 'EEE, dd MMM', {
    locale: language === 'vi' ? vi : enUS
  });
}

export function getGreetingLabel(hour: number, language: AppLanguage = 'vi') {
  if (hour < 11) return translate(language, 'greeting.morning');
  if (hour < 17) return translate(language, 'greeting.afternoon');
  return translate(language, 'greeting.evening');
}
