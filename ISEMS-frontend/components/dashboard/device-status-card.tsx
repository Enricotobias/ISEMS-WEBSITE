'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDeviceStatus, useTelemetry } from '@/hooks'
import { 
  Power, 
  Thermometer, 
  Wind, 
  Wifi,
  AlertTriangle,
  Clock,
  ShieldAlert // Icon baru untuk indikator konflik
} from 'lucide-react'
import { 
  formatTemperature, 
  getModeIcon, 
  getModeColor,
  getRSSIQuality,
  getStatusColor,
  formatRelativeTime,
  getErrorDescription
} from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Device } from '@/lib/types' // Pastikan type Device sudah di-export di lib/types.ts

interface DeviceStatusCardProps {
  device: Device // Ubah props untuk menerima object device lengkap
}

export function DeviceStatusCard({ device }: DeviceStatusCardProps) {
  // Ambil ID dan Nama dari object device
  const { device_id, name: deviceName, mac_address: registeredMac } = device

  const { status, isOnline } = useDeviceStatus(device_id)
  const { latest, isLoading } = useTelemetry(device_id, 1)

  // --- LOGIKA DETEKSI KONFLIK ---
  // Jika ada data telemetry masuk, dan device punya MAC terdaftar,
  // tapi MAC yang masuk TIDAK SAMA dengan yang terdaftar.
  const isConflict = 
    latest?.mac_address && 
    registeredMac && 
    latest.mac_address !== registeredMac

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasError = latest?.error_code && latest.error_code !== 'E0'
  const rssiQuality = latest ? getRSSIQuality(latest.wifi_rssi) : null

  return (
    <Card className={cn(
      "transition-all hover:shadow-lg relative overflow-hidden", // relative & overflow-hidden penting untuk banner
      !isOnline && "opacity-60",
      isConflict && "border-red-500 ring-2 ring-red-100" // Highlight border jika konflik
    )}>
      
      {/* --- WARNING BANNER (DUPLICATE ID) --- */}
      {isConflict && (
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 flex items-center justify-center gap-2 z-10 animate-pulse">
          <ShieldAlert className="w-4 h-4" />
          <span>
            SECURITY ALERT: DUPLICATE ID DETECTED! 
            <span className="hidden md:inline font-normal opacity-90 ml-1">
              (Source MAC: {latest?.mac_address})
            </span>
          </span>
        </div>
      )}

      {/* Tambahkan padding-top extra jika ada alert agar header tidak tertutup */}
      <CardHeader className={cn("transition-all", isConflict ? "pt-10" : "")}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className={cn(
              "h-3 w-3 rounded-full",
              getStatusColor(status)
            )} />
            {deviceName}
          </CardTitle>
          
          {/* Status Badge */}
          <div className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            isOnline 
              ? "bg-green-50 text-green-600" 
              : "bg-gray-100 text-gray-600"
          )}>
            {status.toUpperCase()}
          </div>
        </div>
        
        {/* Last Seen Info */}
        {!isOnline && latest && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Last seen: {formatRelativeTime(latest.timestamp)}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Power Status */}
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <Power className={cn(
              "h-5 w-5",
              latest?.power ? "text-green-500" : "text-gray-400"
            )} />
            <span className="text-sm font-medium">Power</span>
          </div>
          <span className={cn(
            "text-sm font-semibold",
            latest?.power ? "text-green-600" : "text-gray-600"
          )}>
            {latest?.power ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* Temperature & Mode */}
        {latest && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
              <Thermometer className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-xs text-gray-600">Temperature</div>
                <div className="text-lg font-bold text-blue-600">
                  {formatTemperature(latest.current_temp)}
                </div>
              </div>
            </div>

            <div className={cn(
              "flex items-center gap-2 rounded-lg p-3",
              getModeColor(latest.mode)
            )}>
              <span className="text-2xl">{getModeIcon(latest.mode)}</span>
              <div>
                <div className="text-xs text-gray-600">Mode</div>
                <div className="text-sm font-semibold">
                  {latest.mode}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fan Speed & WiFi */}
        {latest && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
              <Wind className="h-5 w-5 text-gray-500" />
              <div>
                <div className="text-xs text-gray-600">Fan Speed</div>
                <div className="text-sm font-semibold">
                  {latest.fan_speed}
                </div>
              </div>
            </div>

            {rssiQuality && (
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <Wifi className={cn("h-5 w-5", rssiQuality.color)} />
                <div>
                  <div className="text-xs text-gray-600">Signal</div>
                  <div className={cn("text-sm font-semibold", rssiQuality.color)}>
                    {rssiQuality.label}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Device Error Alert (E1, E2, etc) */}
        {hasError && latest && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-red-600">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold">
                Error: {latest.error_code}
              </div>
              <div className="text-xs text-red-500">
                {getErrorDescription(latest.error_code)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}