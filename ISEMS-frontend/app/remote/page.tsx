'use client'

import { useState, useEffect } from 'react'
import { useDevices } from '@/hooks'
import { ACRemote } from '@/components/remote/ac-remote' // ✅ Kita pakai komponen ini lagi
import { Card, CardContent } from '@/components/ui/card'
import { Smartphone, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RemotePage() {
  const { devices, isLoading } = useDevices()
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)

  // Auto-select device pertama saat load
  useEffect(() => {
    if (!selectedDeviceId && devices.length > 0 && !isLoading) {
      setSelectedDeviceId(devices[0].device_id)
    }
  }, [devices, isLoading, selectedDeviceId])

  const selectedDevice = devices.find(d => d.device_id === selectedDeviceId)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Smartphone className="h-8 w-8 text-blue-500" />
          Remote Control
        </h1>
        <p className="text-gray-500 mt-1">
          Control your AC devices remotely
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-500">Loading devices...</p>
          </div>
        </div>
      )}

      {/* No Devices */}
      {!isLoading && devices.length === 0 && (
        <Card className="flex items-center justify-center h-96">
          <CardContent className="text-center">
            <Smartphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Devices Available
            </h3>
            <p className="text-gray-500">
              Add a device to start controlling your AC
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Layout */}
      {!isLoading && devices.length > 0 && (
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          
          {/* SIDEBAR: LIST DEVICE */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Select Device
            </h2>
            {devices.map((device) => {
              const isSelected = device.device_id === selectedDeviceId
              const isOnline = device.status === 'online'
              
              return (
                <button
                  key={device.device_id}
                  onClick={() => setSelectedDeviceId(device.device_id)}
                  className={cn(
                    "w-full text-left rounded-lg border-2 p-4 transition-all",
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-3 w-3 rounded-full",
                        isOnline ? "bg-green-500" : "bg-gray-400"
                      )} />
                      <div>
                        <div className={cn(
                          "font-medium",
                          isSelected ? "text-blue-700" : "text-gray-900"
                        )}>
                          {device.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {device.device_id}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <ChevronRight className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* MAIN CONTENT: REMOTE CONTROL COMPONENT */}
          <div>
            {selectedDevice ? (
              selectedDevice.status === 'online' ? (
                // ✅ DI SINI KITA PAKAI KOMPONEN AC-REMOTE
                // Semua logika state, mqtt, dan tampilan ada di dalam komponen ini
                <ACRemote 
                  deviceId={selectedDevice.device_id} 
                  deviceName={selectedDevice.name} 
                />
              ) : (
                // Tampilan Offline
                <Card className="max-w-md mx-auto">
                  <CardContent className="flex flex-col items-center justify-center h-96 text-center">
                    <Smartphone className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Device Offline
                    </h3>
                    <p className="text-gray-500">
                      {selectedDevice.name} is currently offline
                    </p>
                  </CardContent>
                </Card>
              )
            ) : (
              // Belum Pilih Device
              <Card className="max-w-md mx-auto">
                <CardContent className="flex items-center justify-center h-96">
                  <p className="text-gray-500">
                    Select a device from the list
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}