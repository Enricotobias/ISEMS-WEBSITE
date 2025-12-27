'use client'

import { useDevices, useDeviceHealth } from '@/hooks' // Hook baru sudah ada
import { DeviceStatusCard } from '@/components/dashboard/device-status-card'
import { TemperatureChart } from '@/components/dashboard/temperature-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Plus, Activity, Clock, Stethoscope } from 'lucide-react' // Tambah Icon
import { useState } from 'react'
import { formatUptime, getHealthColor } from '@/lib/utils'
import { controlAPI } from '@/lib/api' // Import controlAPI

export default function DashboardPage() {
  const { devices, isLoading, refresh } = useDevices()
  const [refreshing, setRefreshing] = useState(false)
  
  // PERBAIKAN TYPO DI SINI:
  const [isScanning, setIsScanning] = useState(false)

  // Ambil Device ID pertama
  const mainDeviceId = devices.length > 0 ? devices[0].device_id : ''
  const { health, refresh: refreshHealth } = useDeviceHealth(mainDeviceId)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refresh()
    await refreshHealth()
    setTimeout(() => setRefreshing(false), 1000)
  }

  // === FUNGSI SCAN ===
  const handleScanHealth = async () => {
    if (!mainDeviceId) return;
    
    setIsScanning(true);
    try {
      // 1. Kirim Perintah ke ESP32
      await controlAPI.requestDiagnostics(mainDeviceId);
      
      // 2. Tunggu 2.5 detik
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // 3. Refresh data
      await refreshHealth();
      
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setIsScanning(false);
    }
  }

  const activeDevices = devices.filter(d => d.status === 'online')
  const totalDevices = devices.length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Monitor all your AC devices in real-time
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            isLoading={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Devices
            </CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalDevices}</div>
            <p className="text-xs text-gray-500 mt-1">
              {activeDevices.length} active, {totalDevices - activeDevices.length} offline
            </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Online Rate
            </CardTitle>
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {totalDevices > 0 
                ? Math.round((activeDevices.length / totalDevices) * 100)
                : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              System running optimally
            </p>
          </CardContent>
        </Card>

        {/* Card 3: DEVICE HEALTH DENGAN TOMBOL SCAN */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              System Health
            </CardTitle>
            {/* Tombol Scan */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 -mr-2 hover:bg-blue-50" 
              onClick={handleScanHealth}
              disabled={isScanning || !mainDeviceId}
              title="Scan Diagnostics"
            >
              <Stethoscope className={`h-4 w-4 text-blue-500 ${isScanning ? 'animate-pulse' : ''}`} />
            </Button>
          </CardHeader>
          <CardContent>
            {health ? (
              <>
                <div className="flex items-end justify-between">
                  <div className={`text-3xl font-bold ${
                    health.health_score > 80 ? 'text-green-600' : 
                    health.health_score > 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {health.health_score}%
                  </div>
                  {isScanning && (
                    <span className="text-xs text-blue-500 animate-pulse mb-1 font-medium">Scanning...</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${getHealthColor(health.health_status)}`}>
                    {health.health_status}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatUptime(health.uptime_sec)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-between h-full">
                <div className="text-3xl font-bold text-gray-300">--%</div>
                <div className="flex items-center justify-between mt-1">
                   <p className="text-xs text-gray-400">No data</p>
                   <Button 
                     variant="link" 
                     className="text-xs h-auto p-0 text-blue-500"
                     onClick={handleScanHealth}
                     disabled={isScanning}
                   >
                     {isScanning ? 'Scanning...' : 'Scan Now'}
                   </Button>
                </div>
              </div>
            )}
          </CardContent>
          
          {isScanning && (
            <div className="absolute inset-0 bg-white/50 z-10 pointer-events-none" />
          )}
        </Card>
      </div>

      {/* Loading Devices */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-500">Loading devices...</p>
          </div>
        </div>
      )}

      {!isLoading && devices.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <DeviceStatusCard
                key={device.device_id}
                deviceId={device.device_id}
                deviceName={device.name}
              />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {devices.slice(0, 2).map((device) => (
              <TemperatureChart
                key={device.device_id}
                deviceId={device.device_id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}