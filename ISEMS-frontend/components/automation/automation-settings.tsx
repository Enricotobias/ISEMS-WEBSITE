'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/UI/card'
import { Button } from '@/components/UI/button'
import { Settings2, Thermometer, Save, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DeviceSettings } from '@/lib/types'

interface AutomationSettingsProps {
  settings: DeviceSettings
  onChange: (settings: Partial<DeviceSettings>) => void
  onSave: () => void
  onReset: () => void
  isSaving?: boolean
}

export function AutomationSettings({ 
  settings, 
  onChange, 
  onSave, 
  onReset,
  isSaving 
}: AutomationSettingsProps) {
  
  const handleToggleAutomation = () => {
    onChange({ automation: !settings.automation })
  }

  const handleTempChange = (field: 'min_temp' | 'max_temp' | 'set_temp', value: number) => {
    // Validasi range
    if (field === 'min_temp' && value < 16) value = 16
    if (field === 'max_temp' && value > 30) value = 30
    if (field === 'set_temp') {
      if (value < 16) value = 16
      if (value > 30) value = 30
    }
    
    onChange({ [field]: value })
  }

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ set_mode: e.target.value })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-blue-500" />
              Automation Settings
            </CardTitle>
            <CardDescription>
              Configure automation behavior and temperature limits
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={onSave} isLoading={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Automation Toggle */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Automation Mode
              </h3>
              <p className="text-sm text-gray-600">
                Enable automatic AC control based on schedule and temperature
              </p>
            </div>
            
            <button
              onClick={handleToggleAutomation}
              className={cn(
                "relative inline-flex h-12 w-24 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                settings.automation 
                  ? "bg-gradient-to-r from-green-400 to-green-600" 
                  : "bg-gray-300"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-10 w-10 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                  settings.automation ? "translate-x-12" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {/* Status Badge */}
          <div className={cn(
            "mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
            settings.automation 
              ? "bg-green-100 text-green-700" 
              : "bg-gray-100 text-gray-700"
          )}>
            <div className={cn(
              "h-2 w-2 rounded-full",
              settings.automation ? "bg-green-500 animate-pulse" : "bg-gray-500"
            )} />
            {settings.automation ? 'Active' : 'Disabled'}
          </div>
        </div>

        {/* Temperature Settings */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Min Temperature */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Thermometer className="h-4 w-4 text-blue-500" />
              Min Temperature
            </label>
            
            <div className="relative">
              <input
                type="number"
                min="16"
                max="30"
                value={settings.min_temp}
                onChange={(e) => handleTempChange('min_temp', parseInt(e.target.value))}
                disabled={!settings.automation}
                className={cn(
                  "w-full text-center text-3xl font-bold py-4 rounded-lg border-2",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500",
                  !settings.automation && "bg-gray-100 cursor-not-allowed"
                )}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
                °C
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => handleTempChange('min_temp', settings.min_temp - 1)}
                disabled={!settings.automation || settings.min_temp <= 16}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                −
              </button>
              <button
                onClick={() => handleTempChange('min_temp', settings.min_temp + 1)}
                disabled={!settings.automation || settings.min_temp >= 30}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Target Temperature */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Thermometer className="h-4 w-4 text-green-500" />
              Target Temperature
            </label>
            
            <div className="relative">
              <input
                type="number"
                min="16"
                max="30"
                value={settings.set_temp}
                onChange={(e) => handleTempChange('set_temp', parseInt(e.target.value))}
                disabled={!settings.automation}
                className={cn(
                  "w-full text-center text-3xl font-bold py-4 rounded-lg border-2 border-green-500 bg-green-50",
                  "focus:outline-none focus:ring-2 focus:ring-green-500",
                  !settings.automation && "bg-gray-100 border-gray-300 cursor-not-allowed"
                )}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-green-600">
                °C
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => handleTempChange('set_temp', settings.set_temp - 1)}
                disabled={!settings.automation || settings.set_temp <= 16}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
              >
                −
              </button>
              <button
                onClick={() => handleTempChange('set_temp', settings.set_temp + 1)}
                disabled={!settings.automation || settings.set_temp >= 30}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Max Temperature */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Thermometer className="h-4 w-4 text-red-500" />
              Max Temperature
            </label>
            
            <div className="relative">
              <input
                type="number"
                min="16"
                max="30"
                value={settings.max_temp}
                onChange={(e) => handleTempChange('max_temp', parseInt(e.target.value))}
                disabled={!settings.automation}
                className={cn(
                  "w-full text-center text-3xl font-bold py-4 rounded-lg border-2",
                  "focus:outline-none focus:ring-2 focus:ring-red-500",
                  !settings.automation && "bg-gray-100 cursor-not-allowed"
                )}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
                °C
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => handleTempChange('max_temp', settings.max_temp - 1)}
                disabled={!settings.automation || settings.max_temp <= 16}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                −
              </button>
              <button
                onClick={() => handleTempChange('max_temp', settings.max_temp + 1)}
                disabled={!settings.automation || settings.max_temp >= 30}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* AC Mode Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Default AC Mode
          </label>
          
          <select
            value={settings.set_mode}
            onChange={handleModeChange}
            disabled={!settings.automation}
            className={cn(
              "w-full px-4 py-3 rounded-lg border-2 text-gray-900",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              !settings.automation && "bg-gray-100 cursor-not-allowed"
            )}
          >
            <option value="COOL">❄️ Cool</option>
            <option value="DRY">💧 Dry</option>
            <option value="FAN">🌀 Fan</option>
            <option value="HEAT">🔥 Heat</option>
            <option value="AUTO">🤖 Auto</option>
          </select>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="text-2xl">ℹ️</div>
            <div className="flex-1 text-sm text-blue-800">
              <p className="font-semibold mb-1">How it works:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>AC will turn ON when temperature exceeds max temperature</li>
                <li>AC will turn OFF when temperature drops below min temperature</li>
                <li>Target temperature is used for manual adjustments</li>
                <li>Schedule determines when automation is active</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}