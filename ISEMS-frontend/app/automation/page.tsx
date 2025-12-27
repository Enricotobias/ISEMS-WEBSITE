'use client'

import { useState, useEffect } from 'react'
import { useDevices } from '@/hooks'
import { AutomationSettings } from '@/components/automation/automation-settings'
import { ScheduleEditor } from '@/components/automation/schedule-editor'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { controlAPI } from '@/lib/api'
import type { DeviceSettings, DaySchedule } from '@/lib/types'
import useSWR from 'swr'
import axios from 'axios'

export default function AutomationPage() {
  const { devices, isLoading: devicesLoading } = useDevices()
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Fetch device settings
  const { data: settingsData, mutate } = useSWR(
    selectedDeviceId ? `/settings/${selectedDeviceId}` : null,
    async () => {
      // Dummy fetch - ganti dengan API call sebenarnya
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/settings/${selectedDeviceId}`)
      // return response.data
      
      // Mock data untuk development
      return {
        device_id: selectedDeviceId,
        automation: true,
        max_temp: 28,
        min_temp: 20,
        set_temp: 24,
        set_mode: 'COOL',
        system_mode: 'AUTO',
        pause_reason: '-',
        manual_remaining_s: 0,
        schedule_json: [
          { day: 'senin', type: 'full_time' },
          { day: 'selasa', type: 'full_time' },
          { day: 'rabu', type: 'full_time' },
          { day: 'kamis', type: 'full_time' },
          { day: 'jumat', type: 'full_time' },
          { day: 'sabtu', type: 'libur' },
          { day: 'minggu', type: 'libur' },
        ],
        updated_at: new Date().toISOString()
      } as DeviceSettings
    }
  )

  // Local state untuk editing
  const [localSettings, setLocalSettings] = useState<DeviceSettings | null>(null)

  // Auto-select first device
  useEffect(() => {
    if (!selectedDeviceId && devices.length > 0 && !devicesLoading) {
      setSelectedDeviceId(devices[0].device_id)
    }
  }, [devices, devicesLoading, selectedDeviceId])

  // Update local settings saat data berubah
  useEffect(() => {
    if (settingsData) {
      setLocalSettings(settingsData)
    }
  }, [settingsData])

  const handleSettingsChange = (updates: Partial<DeviceSettings>) => {
    if (!localSettings) return
    setLocalSettings({ ...localSettings, ...updates })
  }

  const handleScheduleChange = (schedule: DaySchedule[]) => {
    if (!localSettings) return
    setLocalSettings({ ...localSettings, schedule_json: schedule })
  }

  const handleSaveSettings = async () => {
    if (!localSettings || !selectedDeviceId) return

    setIsSaving(true)
    setSaveStatus('idle')

    try {
      // Kirim ke backend
      await controlAPI.updateSetting(selectedDeviceId, {
        automation: localSettings.automation,
        max_temp: localSettings.max_temp,
        min_temp: localSettings.min_temp,
        set_temp: localSettings.set_temp,
        set_mode: localSettings.set_mode,
      })

      setSaveStatus('success')
      
      // Refresh data
      await mutate()

      // Reset status setelah 3 detik
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
      // Kirim schedule ke backend
      const schedulePayload = {
        daily: localSettings.schedule_json
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/schedule/${selectedDeviceId}`,
        schedulePayload
      )

      setSaveStatus('success')
      
      // Refresh data
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

  const selectedDevice = devices.find(d => d.device_id === selectedDeviceId)

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
                <span className="font-medium">Settings saved successfully!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Failed to save settings</span>
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
                  schedule={localSettings.schedule_json}
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