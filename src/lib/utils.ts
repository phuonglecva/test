import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
}

export function formatDateLabel(date: Date) {
  return format(date, 'EEE, dd MMM');
}

export function getGreetingLabel(hour: number) {
  if (hour < 11) return 'Sáng tốt lành';
  if (hour < 17) return 'Chiều cháy máy';
  return 'Tối bùng nổ';
}
