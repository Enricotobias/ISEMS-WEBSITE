'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Loader2, Info, AlertTriangle } from 'lucide-react'
import { controlAPI } from '@/lib/api'
import { useDevices } from '@/hooks'

export function AckListener() {
  const { devices } = useDevices()
  // Ref untuk menyimpan timestamp pesan terakhir agar tidak muncul double
  const lastProcessedTimeRef = useRef<Record<string, number>>({})

  useEffect(() => {
    if (devices.length === 0) return;

    const checkAcks = async () => {
      for (const device of devices) {
        try {
          // Polling ke Backend untuk mengambil ACK terakhir
          const ack = await controlAPI.getLatestAck(device.device_id);
          
          if (ack && ack.server_received_at) {
            const lastTime = lastProcessedTimeRef.current[device.device_id] || 0;
            // Anggap pesan "baru" jika usianya < 5 detik
            const isFresh = (Date.now() - ack.server_received_at) < 5000; 
            
            // Jika ada data baru yang fresh
            if (ack.server_received_at > lastTime && isFresh) {
              lastProcessedTimeRef.current[device.device_id] = ack.server_received_at;
              
              // Tampilkan Toast
              showAckToast(device.name || device.device_id, ack);
            }
          }
        } catch (error) {
           // Silent error (koneksi backend putus dll)
        }
      }
    };

    // Cek setiap 1 detik (Polling)
    const intervalId = setInterval(checkAcks, 1000); 
    return () => clearInterval(intervalId);
  }, [devices]);

  return null; // Komponen invisible
}

// --- LOGIKA TAMPILAN TOAST ---
function showAckToast(deviceName: string, ack: any) {
  // 1. Mapping Judul agar lebih rapi (Header Notifikasi)
  const titleMap: Record<string, string> = {
    remote: 'Remote Control',
    setting: 'Automation Settings',
    schedule: 'Schedule Update',
    koneksi: 'Connection Settings',
    update: 'Firmware Update',
    diagnostics: 'System Diagnostics',
    reboot: 'System Reboot'
  };

  const title = titleMap[ack.cmd] || ack.cmd.toUpperCase();
  
  // 2. AMBIL DETAIL PESAN APA ADANYA
  // Ini kunci agar Anda tahu alasan error/suksesnya
  const description = `${ack.detail} (${deviceName})`;

  // 3. Logika Warna & Ikon berdasarkan Status & Isi Pesan
  switch (ack.status) {
    case 'success':
      // KONDISI KHUSUS: Sukses tapi sifatnya "Info" (Tidak ada perubahan)
      if (ack.detail === 'No changes detected' || ack.detail.includes('No changes')) {
        toast.info(title, {
          description: description,
          icon: <Info className="h-5 w-5 text-blue-500" />, // Ikon Info Biru
          duration: 3000
        });
      } else {
        // SUKSES STANDAR (Aksi berhasil dilakukan)
        toast.success(title, {
          description: description,
          icon: <CheckCircle className="h-5 w-5 text-green-500" />, // Ikon Centang Hijau
          duration: 4000
        });
      }
      break;

    case 'failed':
      // ERROR (Gagal simpan, gagal parse, dll)
      toast.error(title, {
        description: description, // Pesan error tampil di sini
        icon: <XCircle className="h-5 w-5 text-red-500" />, // Ikon Silang Merah
        duration: 5000 // Tampil lebih lama biar sempat dibaca
      });
      break;

    case 'processing':
      // LOADING (Sedang proses update/diagnostik)
      toast.info(title, {
        description: description,
        icon: <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />, // Ikon Loading
        duration: 3000
      });
      break;

    default:
      // FALLBACK untuk status lain
      toast(title, {
        description: description,
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
      });
      break;
  }
}