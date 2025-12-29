# ISEMS - Intelligent Smart Energy Management System

ISEMS adalah sistem manajemen energi berbasis IoT yang dirancang untuk memantau dan mengontrol perangkat listrik (seperti AC) secara cerdas. Sistem ini terdiri dari **Backend** (Node.js/Express/Knex.js) sebagai pusat kendali dan **Frontend** (Next.js) sebagai antarmuka pengguna.

---

## 📋 Prasyarat (Prerequisites)

Sebelum menjalankan proyek ini, pastikan komputer Anda telah terinstal software berikut:

1. **Node.js** (Minimal versi 18). Download di [nodejs.org](https://nodejs.org/).
2. **MySQL Server** (Disarankan menggunakan XAMPP atau MySQL Workbench).
3. **Git** (Untuk version control).

---

## 🚀 Panduan Instalasi & Menjalankan Project

Ikuti langkah-langkah di bawah ini secara berurutan.

### 1. Persiapan Database
1. Nyalakan modul **MySQL** di XAMPP.
2. Buka database manager (phpMyAdmin atau DBeaver).
3. Buat database baru dengan nama: **`isems_db`**.  
   *Catatan: Anda tidak perlu membuat tabel secara manual, migrasi otomatis akan melakukannya nanti.*

---

### 2. Setup Backend (Server)

Buka **Command Prompt (CMD)** atau Terminal, lalu masuk ke folder backend.

#### A. Install Dependensi
Download semua library yang dibutuhkan (Express, MQTT, Knex, dll).

```bash
cd ISEMS-backend
npm install
```

#### B. Konfigurasi Environment Variable (.env)

Buat file baru bernama `.env` di dalam folder `ISEMS-backend`. Copy-paste konfigurasi di bawah ini:

```env
# Server Port
PORT=5000

# Database Configuration (Sesuaikan dengan XAMPP/MySQL Anda)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=isems_db

# MQTT Broker Configuration (TCP Connection)
# Ganti dengan kredensial broker Anda jika ada
MQTT_HOST=broker.emqx.io
MQTT_PORT=1883
MQTT_USER=
MQTT_PASS=
```

#### C. Migrasi Database (Membuat Tabel Otomatis)

Jalankan perintah ini untuk membuat struktur tabel di database `isems_db`.

```bash
npx knex migrate:latest
```

#### D. Menjalankan Server

```bash
npm run dev
```

*Jika berhasil, akan muncul pesan: `Server running on port 5000` & `Connected to MQTT`.*

---

### 3. Setup Frontend (Website)

Buka terminal baru (biarkan terminal backend tetap jalan), lalu masuk ke folder frontend.

#### A. Install Dependensi

```bash
cd ISEMS-frontend
npm install
```

#### B. Konfigurasi Environment Variable (.env.local)

Buat file baru bernama `.env.local` di dalam folder `ISEMS-frontend`. Isi dengan URL Backend API:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### C. Menjalankan Website

```bash
npm run dev
```

Buka browser dan akses: **http://localhost:3000**

---

## 🛠️ Cheat Sheet Perintah CMD

Berikut adalah daftar perintah yang sering digunakan:

| Aksi | Perintah | Keterangan |
|------|----------|------------|
| **Pindah Folder** | `cd nama_folder` | Masuk ke direktori tertentu |
| **Install Library** | `npm install` | Wajib saat pertama kali clone repo |
| **Migrasi DB** | `npx knex migrate:latest` | Update struktur database (Backend only) |
| **Rollback DB** | `npx knex migrate:rollback` | Membatalkan migrasi terakhir (Backend only) |
| **Jalankan App** | `npm run dev` | Mode development (Auto-reload) |
| **Build App** | `npm run build` | Kompilasi untuk production |
| **Stop Server** | `Ctrl + C` | Tekan tombol Ctrl dan C bersamaan di terminal |

---

## ⚠️ Troubleshooting Umum

- **Error:** `connect ECONNREFUSED 127.0.0.1:3306`  
  **Solusi:** MySQL belum nyala. Buka XAMPP dan klik tombol "Start" pada MySQL.

- **Error:** `Unknown database 'isems_db'`  
  **Solusi:** Anda belum membuat database di phpMyAdmin. Buat database kosong dengan nama `isems_db` lalu jalankan migrasi lagi.

- **Error:** `Client does not support authentication protocol`  
  **Solusi:** Cek user/password database di file `.env`. Default XAMPP adalah user `root` tanpa password.

- **Frontend Data Kosong / Loading Terus**  
  **Solusi:** Pastikan Backend (`npm run dev` di folder backend) sedang berjalan dan tidak ada error.

---

*Created for ISEMS Project - 2025*
