import mqtt from 'mqtt';
import { db } from '../config/db';
import { TelemetryPayload, SettingPayload, AckPayload, InfoPayload, DiagnosticsPayload } from '../interfaces/payloads';
import dotenv from 'dotenv';

dotenv.config();

// Konfigurasi Koneksi MQTT
const mqttUrl = process.env.MQTT_HOST || '';
const mqttOptions: mqtt.IClientOptions = {
    port: Number(process.env.MQTT_PORT) || 8883,
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
    protocol: 'mqtts', 
    rejectUnauthorized: false, 
    reconnectPeriod: 5000,
    connectTimeout: 30 * 1000,
};

console.log(`⏳ Connecting to MQTT: ${mqttUrl} on port ${mqttOptions.port}...`);

const mqttClient = mqtt.connect(mqttUrl, mqttOptions);

// Status koneksi untuk API Status
let isConnected = false;

// Cache untuk mengurangi query INSERT devices berulang
const knownDevices = new Set<string>();

async function ensureDeviceExists(deviceId: string) {
    if (knownDevices.has(deviceId)) return;
    try {
        await db.query(
            `INSERT IGNORE INTO devices (device_id, name, created_at) VALUES (?, ?, NOW())`,
            [deviceId, `Device ${deviceId}`]
        );
        knownDevices.add(deviceId);
    } catch (error) {
        console.error("DB Error (ensureDeviceExists):", error);
    }
}

export const initMqtt = () => {
    
    mqttClient.on('connect', () => {
        console.log('✅ Connected to MQTT Broker');
        isConnected = true;
        mqttClient.subscribe('isems/devices/#');
        mqttClient.subscribe('isems/command/#'); 
    });

    mqttClient.on('error', (err) => {
        console.error('❌ MQTT Connection Error:', err.message);
        isConnected = false;
    });

    mqttClient.on('offline', () => {
        console.log('⚠️ MQTT Client Offline');
        isConnected = false;
    });

    mqttClient.on('message', async (topic, message) => {
        const msgString = message.toString();
        const parts = topic.split('/'); 
        
        if (parts.length < 4 || parts[0] !== 'isems') return;

        const category = parts[1]; 
        const deviceId = parts[2];
        const type = parts[3]; 

        try {
            await ensureDeviceExists(deviceId);

            if (category === 'devices') {
                
                // 1. DATA (Telemetry Suhu & Status)
                if (type === 'data') {
                    const data: TelemetryPayload = JSON.parse(msgString);
                    const isReadUnit = data.read_unit ?? data.read_ok ?? false;

                    await db.query(
                        `INSERT INTO telemetry_logs 
                        (device_id, power, current_temp, mode, fan_speed, error_code, wifi_rssi, rtc_status, read_unit, timestamp)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                        [
                            deviceId, 
                            data.power ? 1 : 0, 
                            data.current_temp, 
                            data.mode, 
                            data.fan_speed, 
                            data.error_code, 
                            data.wifi_rssi, 
                            data.rtc_status || 'UNKNOWN',
                            isReadUnit ? 1 : 0 
                        ]
                    );
                    
                    await db.query(
                        `UPDATE devices SET wifi_ssid = ?, rssi = ?, last_seen = NOW() WHERE device_id = ?`,
                        [data.wifi_ssid, data.wifi_rssi, deviceId]
                    );
                    
                    console.log(`[DATA] ${deviceId}: ${data.current_temp}°C | Read Unit: ${isReadUnit}`);
                }
                
                // 2. STATUS (Online/Offline)
                else if (type === 'status') {
                    let statusStr = msgString;
                    if (msgString.startsWith('{')) {
                        try { const json = JSON.parse(msgString); statusStr = json.status; } catch(e){}
                    }
                    await db.query(
                        `UPDATE devices SET status = ?, last_seen = NOW() WHERE device_id = ?`,
                        [statusStr, deviceId]
                    );
                    console.log(`[STATUS] ${deviceId}: ${statusStr}`);
                }
                
                // 3. SETTING (Update Konfigurasi)
                else if (type === 'setting') {
                    const setting: SettingPayload = JSON.parse(msgString);
                    await db.query(
                        `INSERT INTO device_settings 
                        (device_id, automation, max_temp, min_temp, set_temp, set_mode, system_mode, pause_reason, manual_remaining_s, schedule_json)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE 
                        automation=VALUES(automation), max_temp=VALUES(max_temp), min_temp=VALUES(min_temp),
                        set_temp=VALUES(set_temp), set_mode=VALUES(set_mode), system_mode=VALUES(system_mode),
                        pause_reason=VALUES(pause_reason), manual_remaining_s=VALUES(manual_remaining_s), schedule_json=VALUES(schedule_json),
                        updated_at=NOW()`,
                        [
                            deviceId, setting.automation, setting.max_temp, setting.min_temp, setting.set_temp, 
                            setting.set_mode, setting.system_mode, setting.pause_reason, setting.manual_remaining_s, 
                            JSON.stringify(setting.daily)
                        ]
                    );
                    console.log(`[SETTING] ${deviceId} Updated`);
                }

                // 4. DIAGNOSTICS (SIMPAN KE HEALTH)
                else if (type === 'diagnostics') {
                    // Kita gunakan 'any' atau interface DiagnosticsPayload yang baru
                    const diag: any = JSON.parse(msgString);
                    
                    // === MAPPING DATA SESUAI JSON BARU ===
                    // Lokasi data disesuaikan dengan struktur JSON Anda
                    const uptime = diag.stats?.uptime_sec || 0;
                    
                    const heapFree = diag.memory?.heap_free || 0;
                    const heapFrag = diag.memory?.fragmentation_pct || 0;
                    
                    const crashRate = diag.crash_stats?.crash_rate || 0;
                    const mqttRec = diag.stats?.mqtt_reconnects || 0;
                    const wifiDis = diag.stats?.wifi_disconnects || 0;
                    
                    const fwVer = diag.firmware?.version;
                    const ipAddr = diag.network?.ip;
                    const macAddr = diag.network?.mac;
                    
                    const healthScore = diag.health_score || 0;
                    const healthStatus = diag.health_status || 'UNKNOWN';
                    
                    // Insert ke Device Health
                    await db.query(
                        `INSERT INTO device_health 
                        (device_id, uptime_sec, heap_free, heap_fragmentation, health_score, health_status, crash_rate, mqtt_reconnects, wifi_disconnects, raw_json)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            deviceId, 
                            uptime, 
                            heapFree, 
                            heapFrag,
                            healthScore, 
                            healthStatus, 
                            crashRate,
                            mqttRec, 
                            wifiDis, 
                            msgString
                        ]
                    );

                    // Update Metadata Device
                    if (fwVer || ipAddr) {
                        await db.query(
                            `UPDATE devices SET fw_version = ?, ip_address = ?, mac_address = ? WHERE device_id = ?`,
                            [fwVer, ipAddr, macAddr, deviceId]
                        );
                    }
                    console.log(`[HEALTH] ${deviceId} Diagnostic Saved. Uptime: ${uptime}s, Status: ${healthStatus}`);
                }
                
                // 4b. INFO (HANYA UPDATE METADATA)
                else if (type === 'info') {
                    const info: any = JSON.parse(msgString);
                    // Sesuaikan dengan JSON Info (flat)
                    const fwVer = info.fw_version;
                    const ipAddr = info.ip;
                    
                    // Info tidak mengirim MAC address di payload flat, jadi kita skip update MAC
                    // atau Anda bisa tambahkan field mac di JSON info ESP32 Anda.
                    
                    if (fwVer || ipAddr) {
                        // Gunakan query update dinamis atau biarkan mac_address tidak diupdate
                        await db.query(
                            `UPDATE devices SET fw_version = ?, ip_address = ? WHERE device_id = ?`,
                            [fwVer, ipAddr, deviceId]
                        );
                    }
                    console.log(`[INFO] ${deviceId} Metadata Updated (IP: ${ipAddr})`);
                }
                
                // 5. ACK
                else if (type === 'ack') {
                    const ack: AckPayload = JSON.parse(msgString);
                    await db.query(
                        `INSERT INTO event_logs (device_id, type, command, status, message) VALUES (?, 'ACK', ?, ?, ?)`,
                        [deviceId, ack.cmd, ack.status, ack.detail]
                    );
                    console.log(`[ACK] ${deviceId} ${ack.cmd}: ${ack.status}`);
                }

                // 6. LOGS
                else if (type === 'logs') {
                    await db.query(
                        `INSERT INTO event_logs (device_id, type, message) VALUES (?, 'LOG', ?)`,
                        [deviceId, msgString]
                    );
                    const preview = msgString.length > 50 ? msgString.substring(0, 50) + '...' : msgString;
                    console.log(`[LOG] ${deviceId}: ${preview.replace(/\n/g, ' ')}`);
                }
            }
            else if (category === 'command') {
                await db.query(
                    `INSERT INTO command_history (device_id, command_type, payload, sent_at) 
                     VALUES (?, ?, ?, NOW())`,
                    [deviceId, type, msgString]
                );
                console.log(`[CMD] ${deviceId}: ${type} recorded`);
            }

        } catch (error) {
            console.error(`❌ Error processing ${topic}:`, error);
        }
    });
};

export const sendCommand = (deviceId: string, commandType: string, payload: any) => {
    const topic = `isems/command/${deviceId}/${commandType}`;
    const msg = JSON.stringify(payload);
    
    mqttClient.publish(topic, msg, { qos: 1 }, (err) => {
        if (err) console.error("Publish failed:", err);
        else console.log(`📤 Command sent to ${topic}`);
    });
};

export const getMqttStatus = () => isConnected;