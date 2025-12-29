'use client'

import { useState, useEffect } from 'react'
import { useDevices } from '@/hooks'
import { AutomationSettings } from '@/components/automation/automation-settings'
import { ScheduleEditor } from '@/components/automation/schedule-editor'
import { Card, CardContent } from '@/components/UI/card'
import { Settings, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { automationAPI } from '@/lib/api' // Import API yang benar
import { mqttService } from '@/lib/mqtt'   // Import MQTT Service
import type { DeviceSettings, DaySchedule } from '@/lib/types'
import useSWR from 'swr'

export default function AutomationPage() {
  const { devices, isLoading: devicesLoading } = useDevices()
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  // Local state untuk editing
  const [localSettings, setLocalSettings] = useState<DeviceSettings | null>(null)

  // 1. Fetch device settings dari Database
  const { data: settingsData, mutate } = useSWR(
    selectedDeviceId ? `/settings/${selectedDeviceId}` : null,
    () => automationAPI.getSettings(selectedDeviceId!),
    {
      revalidateOnFocus: false, // Jangan refresh otomatis saat klik window
      onSuccess: (data) => {
        setLocalSettings(data) // Sync local state saat data baru masuk
      }
    }
  )

  // 2. Auto-select device pertama
  useEffect(() => {
    if (!selectedDeviceId && devices.length > 0 && !devicesLoading) {
      setSelectedDeviceId(devices[0].device_id)
    }
  }, [devices, devicesLoading, selectedDeviceId])

  // 3. MQTT Listener (Real-time Updates dari Device Fisik/User Lain)
  useEffect(() => {
    if (!selectedDeviceId) return;

    // Subscribe ke topic setting device
    // Topic ini aktif jika ESP32 melapor ada perubahan setting lokal
    const settingTopic = `isems/devices/${selectedDeviceId}/setting`; 
    
    // Subscribe juga ke topic command (feedback dari backend)
    const commandTopic = `isems/command/${selectedDeviceId}/setting`;

    const cleanup = mqttService.addMessageHandler((topic, message) => {
      if (topic === settingTopic || topic === commandTopic) {
        try {
          const newSettings = JSON.parse(message);
          
          console.log('[MQTT] Received Settings Update:', newSettings);

          // Update state lokal agar UI berubah real-time
          setLocalSettings(prev => {
            if (!prev) return null;
            return {
              ...prev,
              ...newSettings,
              // Handle schedule khusus karena bentuknya array
              schedule_json: newSettings.daily || newSettings.schedule_json || prev.schedule_json,
              // Pastikan automation boolean
              automation: newSettings.automation !== undefined 
                ? (typeof newSettings.automation === 'boolean' ? newSettings.automation : newSettings.automation === 1)
                : prev.automation
            };
          });
        } catch (err) {
          console.error('[MQTT] Parse error:', err);
        }
      }
    });

    return cleanup;
  }, [selectedDeviceId]);


  // Handle perubahan di form UI
  const handleSettingsChange = (updates: Partial<DeviceSettings>) => {
    if (!localSettings) return
    setLocalSettings({ ...localSettings, ...updates })
  }

  const handleScheduleChange = (schedule: DaySchedule[]) => {
    if (!localSettings) return
    setLocalSettings({ ...localSettings, schedule_json: schedule })
  }

  // --- SAVE LOGIC ---
  const handleSaveSettings = async () => {
    if (!localSettings || !selectedDeviceId) return

    setIsSaving(true)
    setSaveStatus('idle')

    try {
      // Panggil API saveSettings
      await automationAPI.saveSettings(selectedDeviceId, localSettings)

      setSaveStatus('success')
      await mutate() // Refresh data SWR
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSchedule = async () => {
    if (!localSettings || !selectedDeviceId) return

    setIsSaving(true)
    setSaveStatus('idle')

    try {
      // Panggil API saveSchedule
      await automationAPI.saveSchedule(selectedDeviceId, localSettings.schedule_json)

      setSaveStatus('success')
      await mutate()
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Failed to save schedule:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (settingsData) {
      setLocalSettings(settingsData)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-500" />
            Automation Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Configure automation and schedule for your devices
          </p>
        </div>

        {/* Save Status Indicator */}
        {saveStatus !== 'idle' && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            saveStatus === 'success' 
              ? 'bg-green-50 text-green-600' 
              : 'bg-red-50 text-red-600'
          }`}>
            {saveStatus === 'success' ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Saved successfully!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Failed to save</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {devicesLoading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-500">Loading devices...</p>
          </div>
        </div>
      )}

      {/* No Devices */}
      {!devicesLoading && devices.length === 0 && (
        <Card className="flex items-center justify-center h-96">
          <CardContent className="text-center">
            <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Devices Available
            </h3>
            <p className="text-gray-500">
              Add a device to configure automation
            </p>
          </CardContent>
        </Card>
      )}

      {/* Device Selection & Settings */}
      {!devicesLoading && devices.length > 0 && (
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Device List Sidebar */}
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
                  className={`w-full text-left rounded-lg border-2 p-4 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <div className={`font-medium ${
                          isSelected ? 'text-blue-700' : 'text-gray-900'
                        }`}>
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

          {/* Settings Content */}
          <div className="space-y-6">
            {localSettings ? (
              <>
                {/* Automation Settings */}
                <AutomationSettings
                  settings={localSettings}
                  onChange={handleSettingsChange}
                  onSave={handleSaveSettings}
                  onReset={handleReset}
                  isSaving={isSaving}
                />

                {/* Schedule Editor */}
                <ScheduleEditor
                  schedule={localSettings.schedule_json || []}
                  onChange={handleScheduleChange}
                  onSave={handleSaveSchedule}
                  isSaving={isSaving}
                />
              </>
            ) : (
              <Card className="flex items-center justify-center h-96">
                <CardContent>
                  <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
                    <p className="text-gray-500">Loading settings...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}