import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function getConfidenceColor(level: string): string {
  const colors = {
    high: 'text-green-600 bg-green-50 border-green-200',
    moderate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-orange-600 bg-orange-50 border-orange-200',
    critical: 'text-red-600 bg-red-50 border-red-200'
  };
  return colors[level as keyof typeof colors] || colors.moderate;
}

export function getPatternColor(pattern: string): string {
  const colors = {
    A: 'blue',
    B: 'green',
    C: 'orange',
    D: 'purple',
    E: 'red',
    F: 'gray'
  };
  return colors[pattern as keyof typeof colors] || 'gray';
}

export function getTrendIcon(trend: string): string {
  const icons = {
    improving: '↗',
    stable: '→',
    declining: '↘'
  };
  return icons[trend as keyof typeof icons] || '→';
}

export function getTrendColor(trend: string): string {
  const colors = {
    improving: 'text-green-600',
    stable: 'text-blue-600',
    declining: 'text-red-600'
  };
  return colors[trend as keyof typeof colors] || 'text-gray-600';
}
