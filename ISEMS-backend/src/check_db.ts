import { db } from './config/db';

async function checkTableStructure() {
    console.log("🔍 Memeriksa struktur tabel 'device_settings'...");
    
    try {
        // Query untuk melihat kolom tabel
        const [rows] = await db.query("DESCRIBE device_settings");
        console.log("\n✅ TABEL DITEMUKAN! Berikut kolom yang ada:");
        console.table(rows);
        
        // Cek manual apakah pause_reason ada
        const columns = (rows as any[]).map(r => r.Field);
        if (columns.includes('pause_reason')) {
            console.log("\n🎉 KOLOM 'pause_reason' DITEMUKAN! Harusnya aman.");
        } else {
            console.log("\n❌ BAHAYA: Kolom 'pause_reason' TIDAK ADA di sini!");
            console.log("👉 Pastikan Anda mengedit database: " + process.env.DB_NAME);
        }

    } catch (error: any) {
        console.error("\n❌ ERROR: Gagal membaca tabel. Apakah nama tabel benar?");
        console.error(error.message);
    }
    process.exit();
}

checkTableStructure();