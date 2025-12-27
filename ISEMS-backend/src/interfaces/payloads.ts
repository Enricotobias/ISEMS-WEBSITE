// ==========================================
// 1. TELEMETRY (Topic: .../data)
// ==========================================
export interface TelemetryPayload {
    power: boolean;
    current_temp: number;
    mode: string;
    fan_speed: string;
    error_code: string;
    wifi_rssi: number;
    wifi_ssid: string;
    rtc_status?: string;
    read_unit?: boolean; 
    read_ok?: boolean; 
    device_time?: string;
    ts?: number;
}

// ==========================================
// 2. SETTINGS (Topic: .../setting)
// ==========================================
export interface ScheduleTime {
    mulai: string;
    selesai: string;
}

export interface DaySchedule {
    day: string;
    type: string; // "full_time", "part_time", "libur"
    waktu?: ScheduleTime;
}

export interface SettingPayload {
    automation: boolean;
    max_temp: number;
    min_temp: number;
    set_temp: number;
    set_mode: string;
    system_mode?: string;
    pause_reason?: string;
    manual_remaining_s?: number;
    daily: DaySchedule[];
}

// ==========================================
// 3. ACKNOWLEDGEMENT (Topic: .../ack)
// ==========================================
export interface AckPayload {
    cmd: string;
    status: string;
    detail: string;
    ts?: number;
}

// ==========================================
// 4. INFO (Topic: .../info)
// ==========================================
export interface InfoPayload {
    fw_version: string;
    ip: string;
    rssi: number;
    uptime: number;
    status: string;
    sensor_connected: boolean;
    timestamp: number;
}

// ==========================================
// 5. DIAGNOSTICS (Topic: .../diagnostics)
// UPDATE: Sesuai data JSON terbaru Anda
// ==========================================
export interface DiagnosticsPayload {
    firmware: {
        version: string;
        built_at: string;
        reset_reason: string;
    };
    network: {
        ip: string;
        mac: string;
        ssid: string;
        rssi: number;
        gateway: string;
        dns: string;
    };
    memory: {
        heap_free: number;
        heap_min: number;
        heap_max_alloc: number;
        fragmentation_pct: number;
    };
    stats: {
        uptime_sec: number;
        mqtt_reconnects: number;
        wifi_disconnects: number;
    };
    crash_stats: {
        total_boots: number;
        total_crashes: number;
        crash_rate: number;
        brownouts: number;
    };
    sensor: {
        healthy: boolean;
        uart_errors: number;
        last_frame_age: number;
        comm_error_inferred: boolean;
    };
    automation: {
        active: boolean;
        manual_mode: boolean;
        auto_on: number;
        auto_off: number;
        manual_override: number;
        ir_sent: number;
    };
    filesystem: {
        used_pct: number;
    };
    health_alerts: string[];
    health_score: number;
    health_status: string;
    timestamp: number;
}

export type AnySystemPayload = InfoPayload | DiagnosticsPayload;