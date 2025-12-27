import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor untuk error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// =================== DEVICES ===================
export const devicesAPI = {
  getAll: () => apiClient.get('/devices'),
  getById: (id: string) => apiClient.get(`/devices/${id}`),
};

// =================== TELEMETRY ===================
export const telemetryAPI = {
  getLogs: (deviceId: string, limit = 50) => 
    apiClient.get(`/logs/${deviceId}`, { params: { limit } }),
  
  getLatest: (deviceId: string) => 
    apiClient.get(`/logs/${deviceId}`, { params: { limit: 1 } }),
};

// =================== (BARU) HEALTH API ===================
export const healthAPI = {
  // Mengambil data kesehatan terakhir
  getLatest: (deviceId: string) => 
    apiClient.get(`/health/${deviceId}`), 
};

// === TAMBAHKAN INI: EVENTS API ===
export const eventsAPI = {
  getLogs: (deviceId: string, limit = 100) => 
    apiClient.get(`/events/${deviceId}`, { params: { limit } }),
};

// =================== CONTROL COMMANDS ===================
export const controlAPI = {
  // Send remote control command
  sendRemote: (deviceId: string, command: RemoteCommand) =>
    apiClient.post(`/control/${deviceId}`, command),
  
  // Update device settings
  updateSetting: (deviceId: string, settings: DeviceSettings) =>
    apiClient.post(`/setting/${deviceId}`, settings),

  // === TAMBAHAN BARU ===
  // Request Diagnostics
  requestDiagnostics: (deviceId: string) =>
    apiClient.post(`/diagnostics/${deviceId}`, {}),
};

// =================== TYPES ===================
export interface Device {
  device_id: string;
  name: string;
  status: string;
  wifi_ssid: string;
  rssi: number;
  last_seen: string;
  fw_version?: string;
  ip_address?: string;
  mac_address?: string;
}

export interface TelemetryLog {
  id: number;
  device_id: string;
  power: boolean;
  current_temp: number;
  mode: string;
  fan_speed: string;
  error_code: string;
  wifi_rssi: number;
  rtc_status: string;
  read_unit: boolean;
  timestamp: string;
}

export interface RemoteCommand {
  power?: boolean;
  temp?: number;
  mode?: 'COOL' | 'DRY' | 'FAN' | 'HEAT' | 'AUTO';
  fan?: 'AUTO' | 'LOW' | 'MID' | 'HIGH';
}

export interface DeviceSettings {
  automation?: boolean;
  max_temp?: number;
  min_temp?: number;
  set_temp?: number;
  set_mode?: string;
  daily?: DaySchedule[];
}

export interface DaySchedule {
  day: string;
  type: 'full_time' | 'part_time' | 'libur';
  waktu?: {
    mulai: string;
    selesai: string;
  };
}

export default apiClient;