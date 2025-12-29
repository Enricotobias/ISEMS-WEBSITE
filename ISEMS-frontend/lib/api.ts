// ISEMS-frontend/lib/api.ts

import axios from 'axios';
import { Device, TelemetryLog, EventLog, DeviceHealth } from './types'; // Pastikan path import benar

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// 1. DEVICES & HEALTH
// ==========================================
export const deviceAPI = {
  // Get All Devices
  getAll: async () => {
    const { data } = await api.get<Device[]>('/devices');
    return data;
  },
  
  // Get Single Device
  getOne: async (id: string) => {
    const { data } = await api.get<Device>(`/devices/${id}/detail`);
    return data;
  },

  // Get Device Health (Baru)
  getHealth: async (id: string) => {
    const { data } = await api.get<DeviceHealth>(`/devices/${id}/health`);
    return data;
  }
};

// ==========================================
// 2. TELEMETRY (Data Sensor)
// ==========================================
export const telemetryAPI = {
  // Get History (Log Suhu)
  getHistory: async (deviceId: string, limit = 20) => {
    // Perhatikan endpoint baru: /telemetry
    const { data } = await api.get<TelemetryLog[]>(`/devices/${deviceId}/telemetry?limit=${limit}`);
    return data;
  },

  // Get Chart Data
  getChartData: async (deviceId: string) => {
    const { data } = await api.get<TelemetryLog[]>(`/devices/${deviceId}/chart`);
    return data;
  }
};

// ==========================================
// 3. SYSTEM LOGS
// ==========================================
export const logsAPI = {
  // Get System Logs
  getAll: async () => {
    // Perhatikan endpoint baru: /system-logs
    const { data } = await api.get<EventLog[]>('/system-logs');
    return data;
  }
};

// ==========================================
// 4. REMOTE CONTROL
// ==========================================
export const controlAPI = {
  // Kirim Command (Power, Temp, Mode)
  sendCommand: async (deviceId: string, type: string, value: any) => {
    // Endpoint baru yang lebih rapi
    const { data } = await api.post(`/devices/${deviceId}/command`, { 
      deviceId, 
      type, 
      value 
    });
    return data;
  },

  // Request Diagnostics (Tombol Scan)
  requestDiagnostics: async (deviceId: string) => {
     // Endpoint khusus refresh
     const { data } = await api.post(`/devices/${deviceId}/refresh`);
     return data;
  },
  // [BARU] Ambil ACK terakhir
  getLatestAck: async (deviceId: string) => {
    const { data } = await api.get(`/devices/${deviceId}/ack`);
    return data;
  },
  // [BARU] Ambil State Remote Terakhir
  getLastState: async (deviceId: string) => {
    const { data } = await api.get(`/devices/${deviceId}/last-state`);
    return data;
  }
};
// ==========================================
// 5. SYSTEM STATUS
// ==========================================
export const systemAPI = {
  getStatus: async () => {
    // Endpoint ini mengembalikan { server: 'Online', mqtt: 'Connected'/'Disconnected' }
    const { data } = await api.get<{ mqtt: string }>('/status');
    return data;
  }
};

// 6. AUTOMATION (Jadwal & Settings)
// ==========================================
export const automationAPI = {
  // Simpan Jadwal
  saveSchedule: async (deviceId: string, schedule: any[]) => {
    // URL Backend: /api/devices/:id/schedule
    const { data } = await api.post(`/devices/${deviceId}/schedule`, { 
      schedule // Data array jadwal dikirim dalam object { schedule: [...] }
    });
    return data;
  },
// [BARU] Simpan Automation Settings
  saveSettings: async (deviceId: string, settings: any) => {
    // Kirim ke endpoint baru: /api/devices/:id/settings
    const { data } = await api.post(`/devices/${deviceId}/settings`, { 
      settings // Data settings dibungkus dalam object
    });
    return data;
  },

  getSettings: async (deviceId: string) => {
    const { data } = await api.get(`/devices/${deviceId}/settings`);
    return data;
  }
};