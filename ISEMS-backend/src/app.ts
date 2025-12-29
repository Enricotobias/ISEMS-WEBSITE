import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './config/db'; // Import Knex
import { initMqtt, sendCommand, getMqttStatus, latestAcks, lastRemoteStates } from './services/mqttService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Init MQTT
initMqtt();

// ============================================================================
// 1. GROUP: DEVICE MANAGEMENT (Info Dasar Perangkat)
// ============================================================================

// [GET] List Semua Devices (Dashboard Utama)
app.get('/api/devices', async (req, res) => {
    try {
        // Ambil list device beserta status terakhirnya
        const devices = await db('devices').select('*').orderBy('created_at', 'asc');
        res.json(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// [GET] Detail Satu Device (Halaman Detail)
app.get('/api/devices/:id/detail', async (req, res) => {
    try {
        const device = await db('devices').where('device_id', req.params.id).first();
        if (!device) return res.status(404).json({ error: 'Device not found' });
        res.json(device);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// [GET] Device Health / Diagnostik
app.get('/api/devices/:id/health', async (req, res) => {
    try {
        // Ambil data kesehatan terakhir dari tabel device_health
        const health = await db('device_health')
            .where('device_id', req.params.id)
            // UBAH DARI 'created_at' MENJADI 'id' ATAU 'timestamp'
            .orderBy('id', 'desc') // Kita pakai 'id' desc agar selalu dapat data paling baru masuk
            .first();
            
        res.json(health || null);
    } catch (error) {
        console.error("Error fetching health:", error); // Tambahkan log agar terlihat di terminal
        res.status(500).json({ error: 'Database error' });
    }
});

// ============================================================================
// 2. GROUP: TELEMETRY DATA (Data Sensor: Suhu, Power, Mode)
// ============================================================================

// [GET] Riwayat Telemetry (Untuk Tabel Log Suhu)
app.get('/api/devices/:id/telemetry', async (req, res) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 50;
        
        const logs = await db('telemetry_logs')
            .where('device_id', req.params.id)
            .orderBy('timestamp', 'desc')
            .limit(limit);
            
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// [GET] Data Chart (Untuk Grafik Suhu - Diurutkan Ascending)
app.get('/api/devices/:id/chart', async (req, res) => {
    try {
        // Ambil 20 data terakhir, tapi urutkan dari lama ke baru agar grafik bagus
        const rows = await db.raw(
            `SELECT * FROM (
                SELECT * FROM telemetry_logs 
                WHERE device_id = ? 
                ORDER BY timestamp DESC LIMIT 20
            ) sub ORDER BY timestamp ASC`,
            [req.params.id]
        );
        
        // Karena .raw mengembalikan [rows, fields], kita ambil rows (index 0)
        res.json(rows[0]); 
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// ============================================================================
// 3. GROUP: SYSTEM LOGS (Log Aktivitas, Error, Ack)
// ============================================================================

// [GET] System Event Logs (Untuk Halaman "Logs" Global)
app.get('/api/system-logs', async (req, res) => {
    try {
        const logs = await db('event_logs')
            .orderBy('id', 'desc')
            .limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// ============================================================================
// 4. GROUP: REMOTE CONTROL (Perintah ke ESP32)
// ============================================================================

// [POST] Kirim Command (Power, Suhu, Mode, Fan)
app.post('/api/devices/:id/command', async (req, res) => {
    const { deviceId, type, value } = req.body;
    
    // Validasi
    if (!deviceId || !type) {
        return res.status(400).json({ error: 'Missing deviceId or command type' });
    }

    try {
        // Kirim ke MQTT
        sendCommand(deviceId, type, value);
        
        // Simpan history command ke database
        await db('command_history').insert({
            device_id: deviceId,
            command_type: type,
            payload: JSON.stringify(value),
            sent_at: db.fn.now()
        });

        res.json({ success: true, message: `Command ${type} sent to ${deviceId}` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send command' });
    }
});

// [POST] Request Update/Diagnostic Manual (Tombol Scan/Refresh)
app.post('/api/devices/:id/refresh', async (req, res) => {
    const deviceId = req.params.id;
    try {
        // Kirim perintah 'get_status' atau 'get_diagnostics' ke ala
        sendCommand(deviceId, 'diagnostics', {}); // Request health terbaru
        
        res.json({ success: true, message: 'Refresh signal sent' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send refresh signal' });
    }
});

// ============================================================================
// 5. SERVER STATUS
// ============================================================================
app.get('/api/status', async (req, res) => { // <--- Tambah async
    let dbStatus = 'Disconnected';
    
    // 1. Cek Koneksi Database
    try {
        await db.raw('SELECT 1'); // Query ringan untuk ping database
        dbStatus = 'Connected';
    } catch (error) {
        // Jangan log error heboh, cukup tahu kalau DB mati
        dbStatus = 'Disconnected'; 
    }

    // 2. Cek Koneksi MQTT
    const mqttStatus = getMqttStatus() ? 'Connected' : 'Disconnected';

    // 3. Kirim Status Lengkap
    res.json({ 
        server: 'Online', 
        mqtt: mqttStatus,
        database: dbStatus, // <--- Field baru
        timestamp: new Date() 
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

// [POST] Update Schedule (Smart Diffing Update)
app.post('/api/devices/:id/schedule', async (req, res) => {
    const deviceId = req.params.id;
    
    // 1. Terima Jadwal FULL BARU dari Frontend
    const newSchedule = req.body.schedule || req.body.daily;

    if (!newSchedule || !Array.isArray(newSchedule)) {
        return res.status(400).json({ error: 'Invalid schedule data format' });
    }

    try {
        // 2. Ambil Jadwal LAMA dari Database (Sebelum di-update)
        const currentSettings = await db('device_settings')
            .select('schedule_json')
            .where({ device_id: deviceId })
            .first();

        let oldSchedule: any[] = [];
        try {
            if (currentSettings && currentSettings.schedule_json) {
                // Handle jika tersimpan sebagai string atau sudah JSON object
                oldSchedule = typeof currentSettings.schedule_json === 'string' 
                    ? JSON.parse(currentSettings.schedule_json) 
                    : currentSettings.schedule_json;
            }
        } catch (e) {
            console.warn("Failed to parse old schedule, assuming empty.");
        }

        // 3. LOGIKA DIFF: Cari hari apa saja yang berubah
        const changes = newSchedule.filter(newDay => {
            // Cari hari yang sama di data lama
            const oldDay = oldSchedule.find((d: any) => d.day === newDay.day);

            // Jika hari ini belum ada di data lama (setting baru), anggap berubah
            if (!oldDay) return true;

            // Bandingkan Tipe (full_time / part_time / libur)
            if (oldDay.type !== newDay.type) return true;

            // Jika tipe sama-sama 'part_time', bandingkan jamnya
            if (newDay.type === 'part_time') {
                const oldStart = oldDay.waktu?.mulai;
                const oldEnd = oldDay.waktu?.selesai;
                const newStart = newDay.waktu?.mulai;
                const newEnd = newDay.waktu?.selesai;

                if (oldStart !== newStart || oldEnd !== newEnd) return true;
            }

            // Jika sampai sini, berarti TIDAK ada perubahan untuk hari ini
            return false;
        });

        // 4. Simpan Jadwal FULL BARU ke Database 
        // (PENTING: DB harus tetap pegang data lengkap agar Frontend konsisten saat reload)
        await db('device_settings')
            .where({ device_id: deviceId })
            .update({
                schedule_json: JSON.stringify(newSchedule),
                updated_at: db.fn.now()
            });

        // 5. Kirim ke MQTT HANYA YANG BERUBAH
        if (changes.length > 0) {
            console.log(`[SCHEDULE] Sending update for ${changes.length} days:`, changes.map((d:any) => d.day));
            
            sendCommand(deviceId, 'schedule', { 
                daily: changes, // Hanya kirim array hari yang berubah
                ts: Date.now() 
            });
            
            res.json({ 
                success: true, 
                message: `Schedule updated. Sent ${changes.length} changes to device.`,
                changes: changes 
            });
        } else {
            console.log('[SCHEDULE] No changes detected, skipping MQTT publish.');
            // Tidak perlu kirim ke MQTT jika tidak ada perubahan, hemat bandwidth
            res.json({ success: true, message: 'Schedule saved to DB (No changes sent to device).' });
        }

    } catch (error) {
        console.error('Error saving schedule:', error);
        res.status(500).json({ error: 'Failed to save schedule' });
    }
});

// [POST] Update Automation Settings (Suhu, Mode, Otomasi)
// URL: /api/devices/:id/settings
app.post('/api/devices/:id/settings', async (req, res) => {
    const deviceId = req.params.id;
    const { settings } = req.body; // Frontend mengirim { settings: { ... } }

    if (!settings) {
        return res.status(400).json({ error: 'Settings data required' });
    }

    try {
        // 1. Simpan ke Database (Update tabel device_settings)
        // Kita update kolom-kolom spesifik sesuai input form
        await db('device_settings')
            .where({ device_id: deviceId })
            .update({
                automation: settings.automation ? 1 : 0, // Convert boolean ke tinyint
                max_temp: settings.max_temp,
                min_temp: settings.min_temp,
                set_temp: settings.set_temp,
                set_mode: settings.set_mode,
                updated_at: db.fn.now()
            });

        // 2. Kirim ke MQTT agar ESP32 langsung berubah perilakunya
        // Payload dikirim flat/langsung agar mudah diparse di ESP32
        sendCommand(deviceId, 'setting', { 
            automation: settings.automation,
            max_temp: settings.max_temp,
            min_temp: settings.min_temp,
            set_temp: settings.set_temp,
            set_mode: settings.set_mode,
            ts: Date.now() 
        });

        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Save Settings Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// [GET] Ambil Automation Settings
app.get('/api/devices/:id/settings', async (req, res) => {
    try {
        const settings = await db('device_settings')
            .where({ device_id: req.params.id })
            .first();
            
        // Jika belum ada setting, kembalikan default
        if (!settings) {
            return res.json({
                device_id: req.params.id,
                automation: 0,
                max_temp: 30,
                min_temp: 16,
                set_temp: 24,
                set_mode: 'COOL',
                schedule_json: []
            });
        }

        // Parsing JSON schedule karena di DB tersimpan sebagai string
        if (typeof settings.schedule_json === 'string') {
            settings.schedule_json = JSON.parse(settings.schedule_json);
        }
        
        // Convert automation (0/1) ke boolean
        settings.automation = settings.automation === 1;

        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/devices/:id/ack', (req, res) => {
    const deviceId = req.params.id;
    // Ambil dari Memory mqttService
    const ack = latestAcks.get(deviceId);
    
    // Jika tidak ada data di memory, return null
    if (!ack) return res.json(null);
    
    res.json(ack);
});

app.get('/api/devices/:id/last-state', async (req, res) => {
    const deviceId = req.params.id;
    
    // 1. Coba ambil dari Command Remote History (paling baru)
    let state: any = null;
    try {
        // Ambil command remote terakhir dari history
        const lastLog = await db('command_history')
            .where({ device_id: deviceId, command_type: 'remote' })
            .orderBy('sent_at', 'desc')
            .first();

        if (lastLog && lastLog.payload) {
            state = typeof lastLog.payload === 'string' 
                ? JSON.parse(lastLog.payload) 
                : lastLog.payload;
        }
    } catch (e) {
        console.error('DB Fetch Error:', e);
    }
    // 3. [BARU] Fallback ke Device Settings (Data Automation)
    // Jika belum pernah diremote sama sekali, ambil nilai dari menu Automation
    if (!state) {
        try {
            const settings = await db('device_settings')
                .where({ device_id: deviceId })
                .first();

            if (settings) {
                // Mapping dari kolom DB Settings -> Format State Remote
                state = {
                    temp: settings.set_temp || 24,
                    mode: settings.set_mode || 'COOL',
                    // Gunakan default AUTO jika kolom fan_speed tidak ada di tabel settings
                    fan: settings.fan_speed || 'AUTO', 
                    // Default OFF karena settings biasanya tidak menyimpan status nyala/mati realtime
                    power: false 
                };
            }
        } catch (e) {
            console.error('DB Fetch Error last-state settings:', e);
        }
    }
    
    // Default fallback jika DB juga kosong (Belum pernah diremote)
    if (!state) {
        state = { temp: 24, mode: 'COOL', fan: 'AUTO', power: false };
    }
    
    res.json(state);
});