import mqtt from 'mqtt';
import db from '../config/db';
import { TelemetryPayload, SettingPayload, AckPayload } from '../interfaces/payloads'; // Pastikan import sesuai
import dotenv from 'dotenv';


dotenv.config();
export const latestAcks = new Map<string, any>();
export const lastRemoteStates = new Map<string, any>();
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
        await db.raw(
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
                
                // ============================================================
                // 1. DATA (Telemetry Suhu & Status) - DIGABUNG DI SINI
                // ============================================================
                if (type === 'data') {
                    const data: TelemetryPayload = JSON.parse(msgString);
                    
                    // Ambil MAC dari payload (handle key "mac" atau "mac_address")
                    // Gunakan 'any' casting sementara jika type TelemetryPayload belum diupdate
                    const incomingMac = (data as any).mac || (data as any).mac_address;
                    
                    const isReadUnit = data.read_unit ?? (data as any).read_ok ?? false;

                    // --- A. LOGIKA DETEKSI KONFLIK ---
                    const registeredDevice = await db('devices').where({ device_id: deviceId }).first();

                    if (registeredDevice) {
                        // Jika device sudah punya MAC terdaftar, tapi MAC yang masuk BEDA
                        if (registeredDevice.mac_address && incomingMac && registeredDevice.mac_address !== incomingMac) {
                            console.warn(`⚠️ CONFLICT DETECTED! DeviceID: ${deviceId} is being used by Intruder MAC: ${incomingMac}. Registered MAC: ${registeredDevice.mac_address}`);
                        } 
                        // Jika device belum punya MAC (pertama kali connect), simpan sebagai pemilik sah
                        else if (!registeredDevice.mac_address && incomingMac) {
                            await db('devices').where({ device_id: deviceId }).update({ mac_address: incomingMac });
                            console.log(`🔐 Device ${deviceId} registered to MAC: ${incomingMac}`);
                        }
                    }

                    // --- B. INSERT KE TELEMETRY LOGS (TERMASUK MAC ADDRESS) ---
                    // Menggunakan db.raw agar konsisten dengan style sebelumnya
                    await db.raw(
                        `INSERT INTO telemetry_logs 
                        (device_id, mac_address, power, current_temp, mode, fan_speed, error_code, wifi_rssi, rtc_status, read_unit, timestamp)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                        [
                            deviceId,
                            incomingMac || null, // Pastikan masuk ke kolom mac_address
                            data.power ? 1 : 0, 
                            data.current_temp, 
                            data.mode, 
                            data.fan_speed, 
                            data.error_code || 'E0', 
                            data.wifi_rssi, 
                            data.rtc_status || 'UNKNOWN',
                            isReadUnit ? 1 : 0 
                        ]
                    );
                    
                    // --- C. UPDATE LAST SEEN DEVICE ---
                    await db.raw(
                        `UPDATE devices SET wifi_ssid = ?, rssi = ?, last_seen = NOW() WHERE device_id = ?`,
                        [data.wifi_ssid, data.wifi_rssi, deviceId]
                    );
                    
                    console.log(`[DATA] ${deviceId}: ${data.current_temp}°C | MAC: ${incomingMac}`);
                }
                
                // ============================================================
                // 2. STATUS (Online/Offline)
                // ============================================================
                else if (type === 'status') {
                    let statusStr = msgString;
                    if (msgString.startsWith('{')) {
                        try { const json = JSON.parse(msgString); statusStr = json.status; } catch(e){}
                    }
                    await db.raw(
                        `UPDATE devices SET status = ?, last_seen = NOW() WHERE device_id = ?`,
                        [statusStr, deviceId]
                    );
                    console.log(`[STATUS] ${deviceId}: ${statusStr}`);
                }
                
                // ============================================================
                // 3. SETTING (Update Konfigurasi)
                // ============================================================
                else if (type === 'setting') {
                    const setting: SettingPayload = JSON.parse(msgString);
                    await db.raw(
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

                // ============================================================
                // 4. DIAGNOSTICS (SIMPAN KE HEALTH)
                // ============================================================
                else if (type === 'diagnostics') {
                    const diag: any = JSON.parse(msgString);
                    
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
                    
                    await db.raw(
                        `INSERT INTO device_health 
                        (device_id, uptime_sec, heap_free, heap_fragmentation, health_score, health_status, crash_rate, mqtt_reconnects, wifi_disconnects, raw_json)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            deviceId, uptime, heapFree, heapFrag, healthScore, healthStatus, 
                            crashRate, mqttRec, wifiDis, msgString
                        ]
                    );

                    // Update Metadata Device termasuk MAC jika ada di diagnostic
                    if (fwVer || ipAddr || macAddr) {
                        // Kita bangun query update dinamis sedikit agar aman
                        await db('devices')
                            .where({ device_id: deviceId })
                            .update({
                                ...(fwVer && { fw_version: fwVer }),
                                ...(ipAddr && { ip_address: ipAddr }),
                                ...(macAddr && { mac_address: macAddr })
                            });
                    }
                    console.log(`[HEALTH] ${deviceId} Diagnostic Saved. Status: ${healthStatus}`);
                }
                
                // ============================================================
                // 4b. INFO (HANYA UPDATE METADATA)
                // ============================================================
                else if (type === 'info') {
                    const info: any = JSON.parse(msgString);
                    const fwVer = info.fw_version;
                    const ipAddr = info.ip;
                    
                    if (fwVer || ipAddr) {
                         await db('devices')
                            .where({ device_id: deviceId })
                            .update({
                                ...(fwVer && { fw_version: fwVer }),
                                ...(ipAddr && { ip_address: ipAddr }),
                            });
                    }
                    console.log(`[INFO] ${deviceId} Metadata Updated`);
                }
                
                // ============================================================
                // 5. ACK
                // ============================================================
                    else if (type === 'ack') {
                    const ack: AckPayload = JSON.parse(msgString);
                    
                    // 1. Simpan ke DB (History)
                    await db.raw(
                        `INSERT INTO event_logs (device_id, type, command, status, message) VALUES (?, 'ACK', ?, ?, ?)`,
                        [deviceId, ack.cmd, ack.status, ack.detail]
                    );

                    // 2. [BARU] Simpan ke Memory untuk Polling Frontend
                    latestAcks.set(deviceId, {
                        ...ack,
                        server_received_at: Date.now()
                    });

                    console.log(`[ACK] ${deviceId} ${ack.cmd}: ${ack.status}`);
                }   

                // ============================================================
                // 6. LOGS
                // ============================================================
                else if (type === 'logs') {
                    await db.raw(
                        `INSERT INTO event_logs (device_id, type, message) VALUES (?, 'LOG', ?)`,
                        [deviceId, msgString]
                    );
                    const preview = msgString.length > 50 ? msgString.substring(0, 50) + '...' : msgString;
                    console.log(`[LOG] ${deviceId}: ${preview.replace(/\n/g, ' ')}`);
                }
            }
            else if (category === 'command') {
                await db.raw(
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