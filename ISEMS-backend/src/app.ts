import express from 'express';
// Gunakan 'import type' untuk Request & Response agar aman dari error TS1295/TS1484
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initMqtt, sendCommand } from './services/mqttService';
import { db } from './config/db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inisialisasi MQTT Listener
initMqtt();

// === API ROUTES ===

// 1. Get All Devices
app.get('/api/devices', async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM devices');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// 2. Get Telemetry History
app.get('/api/logs/:deviceId', async (req: Request, res: Response) => {
    try {
        // Casting 'as string' untuk memaksa tipe data menjadi string
        const deviceId = req.params.deviceId as string;
        
        // Cek validasi sederhana
        if (!deviceId) {
            res.status(400).json({ error: 'Device ID is required' });
            return;
        }

        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
        
        const [rows] = await db.query(
            'SELECT * FROM telemetry_logs WHERE device_id = ? ORDER BY timestamp DESC LIMIT ?', 
            [deviceId, limit]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// 3. Send Remote Command
app.post('/api/control/:deviceId', (req: Request, res: Response) => {
    const deviceId = req.params.deviceId as string;
    const command = req.body;
    
    if (!deviceId) {
        res.status(400).json({ error: 'Device ID is required' });
        return;
    }

    // Kirim ke MQTT via service
    sendCommand(deviceId, 'remote', command);
    
    res.json({ success: true, message: 'Command sent' });
});

// 4. Update Setting
app.post('/api/setting/:deviceId', (req: Request, res: Response) => {
    const deviceId = req.params.deviceId as string;
    const setting = req.body;
    
    if (!deviceId) {
        res.status(400).json({ error: 'Device ID is required' });
        return;
    }

    sendCommand(deviceId, 'setting', setting);
    
    res.json({ success: true, message: 'Setting update queued' });
});

// 5. Get Device Health
app.get('/api/health/:deviceId', async (req: Request, res: Response) => {
    try {
        const deviceId = req.params.deviceId as string;
        
        if (!deviceId) {
            res.status(400).json({ error: 'Device ID is required' });
            return;
        }

        // Ambil 1 data kesehatan terbaru
        const [rows] = await db.query(
            'SELECT * FROM device_health WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1', 
            [deviceId]
        );
        
        // Ambil item pertama dari array hasil query
        const healthData = (rows as any[])[0] || null;
        
        res.json(healthData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/diagnostics/:deviceId', (req: Request, res: Response) => {
    const deviceId = req.params.deviceId as string;
    
    if (!deviceId) {
        res.status(400).json({ error: 'Device ID is required' });
        return;
    }

    // Kirim perintah kosong {} ke topik command diagnostics
    // ESP32 Anda sudah diprogram untuk merespon ini (lihat data.cpp baris 777)
    sendCommand(deviceId, 'diagnostics', {});
    
    res.json({ success: true, message: 'Diagnostics requested' });
});

app.get('/api/events/:deviceId', async (req: Request, res: Response) => {
    try {
        const deviceId = req.params.deviceId as string;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 100; // Default 100 log terakhir
        
        if (!deviceId) {
            res.status(400).json({ error: 'Device ID is required' });
            return;
        }

        const [rows] = await db.query(
            'SELECT * FROM event_logs WHERE device_id = ? ORDER BY timestamp DESC LIMIT ?', 
            [deviceId, limit]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});