import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, format } from "date-fns"
import { id as localeId } from "date-fns/locale"

// =================== TAILWIND MERGE ===================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// =================== DATE FORMATTING ===================
export function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return format(date, "dd MMM yyyy, HH:mm:ss", { locale: localeId })
}

export function formatRelativeTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return formatDistanceToNow(date, { addSuffix: true, locale: localeId })
}

export function formatTimeOnly(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return format(date, "HH:mm:ss")
}

export function formatDateOnly(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return format(date, "dd MMM yyyy", { locale: localeId })
}

// =================== TEMPERATURE UTILS ===================
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`
}

export function getTemperatureColor(temp: number): string {
  if (temp < 20) return "text-blue-500"
  if (temp < 25) return "text-green-500"
  if (temp < 28) return "text-yellow-500"
  return "text-red-500"
}

// =================== RSSI UTILS ===================
export function getRSSIQuality(rssi: number): {
  label: string
  color: string
  icon: string
} {
  if (rssi >= -50) return { 
    label: "Excellent", 
    color: "text-green-500", 
    icon: "📶" 
  }
  if (rssi >= -60) return { 
    label: "Good", 
    color: "text-green-400", 
    icon: "📶" 
  }
  if (rssi >= -70) return { 
    label: "Fair", 
    color: "text-yellow-500", 
    icon: "📶" 
  }
  if (rssi >= -80) return { 
    label: "Weak", 
    color: "text-orange-500", 
    icon: "📶" 
  }
  return { 
    label: "Poor", 
    color: "text-red-500", 
    icon: "📵" 
  }
}

// =================== STATUS UTILS ===================
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'online':
      return "bg-green-500"
    case 'offline':
      return "bg-gray-400"
    case 'updating':
      return "bg-blue-500 animate-pulse"
    case 'rebooting':
      return "bg-orange-500 animate-pulse"
    default:
      return "bg-gray-400"
  }
}

export function getHealthColor(health: string): string {
  switch (health.toUpperCase()) {
    case 'HEALTHY':
    case 'GOOD':
      return "text-green-500 bg-green-50"
    case 'WARNING':
    case 'FAIR':
      return "text-yellow-500 bg-yellow-50"
    case 'CRITICAL':
    case 'POOR':
      return "text-red-500 bg-red-50"
    default:
      return "text-gray-500 bg-gray-50"
  }
}

// =================== AC MODE UTILS ===================
export function getModeIcon(mode: string): string {
  switch (mode.toUpperCase()) {
    case 'COOL':
      return "❄️"
    case 'DRY':
      return "💧"
    case 'FAN':
      return "🌀"
    case 'HEAT':
      return "🔥"
    case 'AUTO':
      return "🤖"
    default:
      return "⚙️"
  }
}

export function getModeColor(mode: string): string {
  switch (mode.toUpperCase()) {
    case 'COOL':
      return "text-blue-500 bg-blue-50"
    case 'DRY':
      return "text-cyan-500 bg-cyan-50"
    case 'FAN':
      return "text-gray-500 bg-gray-50"
    case 'HEAT':
      return "text-red-500 bg-red-50"
    case 'AUTO':
      return "text-purple-500 bg-purple-50"
    default:
      return "text-gray-500 bg-gray-50"
  }
}

// =================== FAN SPEED UTILS ===================
export function getFanIcon(speed: string): string {
  switch (speed.toUpperCase()) {
    case 'HIGH':
      return "🌀🌀🌀"
    case 'MID':
      return "🌀🌀"
    case 'LOW':
      return "🌀"
    case 'AUTO':
      return "🤖"
    default:
      return "⚙️"
  }
}

// =================== ERROR CODE UTILS ===================
export function getErrorDescription(code: string): string {
  const errorMap: { [key: string]: string } = {
    'E0': 'No Error',
    'E1': 'Room Temperature Sensor Error',
    'E2': 'Evaporator Temperature Sensor Error',
    'E3': 'Condenser Temperature Sensor Error',
    'E4': 'Outdoor Unit Error',
    'E5': 'Communication Error',
    'E6': 'Communication Error (Inferred)',
    'E7': 'Mode Conflict',
    'E8': 'Compressor Protection',
    'E9': 'System Error',
  }
  
  return errorMap[code] || `Unknown Error (${code})`
}

export function isErrorCritical(code: string): boolean {
  return ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E9'].includes(code)
}

// =================== UPTIME UTILS ===================
export function formatUptime(seconds: number): string {
  if (!seconds || seconds < 0) return '0m';

  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  // 1. Jika lebih dari 1 hari -> Tampilkan Hari, Jam, Menit
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  
  // 2. Jika lebih dari 1 jam -> Tampilkan Jam & Menit
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  // 3. Jika kurang dari 1 jam -> Tampilkan Menit saja
  return `${minutes}m`;
}

// =================== MEMORY UTILS ===================
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

// =================== VALIDATION UTILS ===================
export function isValidTemperature(temp: number): boolean {
  return temp >= 16 && temp <= 30
}

export function isValidTime(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

// =================== SCHEDULE UTILS ===================
export function getScheduleTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    'full_time': 'Full Time',
    'part_time': 'Part Time',
    'libur': 'Libur'
  }
  return labels[type] || type
}

export function getDayName(day: string): string {
  const dayNames: { [key: string]: string } = {
    'senin': 'Senin',
    'selasa': 'Selasa',
    'rabu': 'Rabu',
    'kamis': 'Kamis',
    'jumat': 'Jumat',
    'sabtu': 'Sabtu',
    'minggu': 'Minggu'
  }
  return dayNames[day.toLowerCase()] || day
}