// =================== DEVICE TYPES ===================
export interface Device {
  device_id: string;
  name: string;
  status: 'online' | 'offline' | 'updating' | 'rebooting';
  wifi_ssid?: string;
  rssi?: number;
  last_seen: string;
  fw_version?: string;
  ip_address?: string;
  mac_address: string;
  created_at?: string;
}

// =================== TELEMETRY TYPES ===================
export interface TelemetryLog {
  id: number;
  device_id: string;
  power: boolean;
  mac_address?: string;
  current_temp: number;
  mode: ACMode;
  fan_speed: FanSpeed;
  error_code: string;
  wifi_rssi: number;
  rtc_status: string;
  read_unit: boolean;
  timestamp: string;
}

export type ACMode = 'COOL' | 'DRY' | 'FAN' | 'HEAT' | 'AUTO';
export type FanSpeed = 'AUTO' | 'LOW' | 'MID' | 'HIGH';

// =================== DEVICE SETTINGS TYPES ===================
export interface DeviceSettings {
  device_id: string;
  automation: boolean;
  max_temp: number;
  min_temp: number;
  set_temp: number;
  set_mode: ACMode;
  system_mode: 'AUTO' | 'MANUAL_RECOVERY' | 'OFF';
  pause_reason: string;
  manual_remaining_s: number;
  schedule_json: DaySchedule[];
  updated_at: string;
}

export interface DaySchedule {
  day: string;
  type: 'full_time' | 'part_time' | 'libur';
  waktu?: {
    mulai: string;
    selesai: string;
  };
}

// =================== DEVICE HEALTH TYPES ===================
export interface DeviceHealth {
  id: number;
  device_id: string;
  uptime_sec: number;
  heap_free: number;
  heap_fragmentation: number;
  health_score: number;
  health_status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  crash_rate: number;
  mqtt_reconnects: number;
  wifi_disconnects: number;
  raw_json: string;
  timestamp: string;
}

// =================== REMOTE CONTROL TYPES ===================
export interface RemoteCommand {
  power?: boolean;
  temp?: number;
  mode?: ACMode;
  fan?: FanSpeed;
}

export interface RemoteControlState {
  power: boolean;
  temp: number;
  mode: ACMode;
  fan: FanSpeed;
}

// =================== EVENT LOGS TYPES ===================
export interface EventLog {
  id: number;
  device_id: string;
  type: 'ACK' | 'LOG';
  command?: string;
  status?: 'success' | 'failed' | 'processing';
  message: string;
  timestamp: string;
}

// =================== MQTT MESSAGE TYPES ===================
export interface MQTTDataMessage {
  power: boolean;
  current_temp: number;
  mode: ACMode;
  fan_speed: FanSpeed;
  error_code: string;
  wifi_rssi: number;
  wifi_ssid: string;
  rtc_status: string;
  read_unit: boolean;
}

export interface MQTTStatusMessage {
  status: string;
  last_disconnect?: string;
  offline_duration_s?: number;
}

export interface MQTTSettingMessage {
  automation: boolean;
  max_temp: number;
  min_temp: number;
  set_temp: number;
  set_mode: ACMode;
  system_mode: string;
  pause_reason: string;
  manual_remaining_s: number;
  daily: DaySchedule[];
}

export interface MQTTAckMessage {
  cmd: string;
  status: 'success' | 'failed' | 'processing';
  detail: string;
  ts: number;
}

// =================== UI STATE TYPES ===================
export interface DashboardData {
  devices: Device[];
  telemetry: { [deviceId: string]: TelemetryLog[] };
  health: { [deviceId: string]: DeviceHealth };
  settings: { [deviceId: string]: DeviceSettings };
}

export interface RemoteControlProps {
  deviceId: string;
  currentState: RemoteControlState;
  onCommand: (command: RemoteCommand) => void;
  isLoading?: boolean;
}

// =================== UTILITY TYPES ===================
export interface TimeRange {
  start: Date;
  end: Date;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export const AC_MODES: ACMode[] = ['COOL', 'DRY', 'FAN', 'HEAT', 'AUTO'];
export const FAN_SPEEDS: FanSpeed[] = ['AUTO', 'LOW', 'MID', 'HIGH'];

export const DAYS_OF_WEEK = [
  'senin',
  'selasa',
  'rabu',
  'kamis',
  'jumat',
  'sabtu',
  'minggu'
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];