import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './config/db'; // Import Knex
import { initMqtt, sendCommand, getMqttStatus } from './services/mqttService';

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
app.get('/api/status', (req, res) => {
    res.json({ 
        server: 'Online', 
        mqtt: getMqttStatus() ? 'Connected' : 'Disconnected',
        timestamp: new Date() 
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});