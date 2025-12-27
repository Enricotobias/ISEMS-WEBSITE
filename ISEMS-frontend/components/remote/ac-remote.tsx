'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRemoteControl, useTelemetry } from '@/hooks'
import { 
  Power, ChevronUp, ChevronDown, Wind, 
  Snowflake, Droplets, Fan, Gauge 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ACMode, FanSpeed } from '@/lib/types'

interface ACRemoteProps {
  deviceId: string
  deviceName: string
}

export function ACRemote({ deviceId, deviceName }: ACRemoteProps) {
  // Hapus isLoading dari destructuring agar tombol tidak disable/macet
  const { sendCommand } = useRemoteControl(deviceId) 
  const { latest } = useTelemetry(deviceId, 1)
  
  // State Lokal
  const [power, setPower] = useState(false)
  const [temperature, setTemperature] = useState(24)
  const [mode, setMode] = useState<ACMode>('COOL')
  const [fanSpeed, setFanSpeed] = useState<FanSpeed>('AUTO')

  // REF PENTING: Untuk mencatat kapan terakhir user klik tombol
  const lastUserActionTime = useRef<number>(0)

  // Sync dengan MQTT (Hanya jika user TIDAK sedang klik tombol)
  useEffect(() => {
    if (latest) {
      const now = Date.now();
      // JIKA sudah lebih dari 3 detik sejak klik terakhir, BARU boleh sync
      if (now - lastUserActionTime.current > 3000) {
        setPower(latest.power)
        // Pastikan dikonversi ke Number agar kalkulasi +1/-1 aman
        if (latest.current_temp) setTemperature(Number(latest.current_temp))
        if (latest.mode) setMode(latest.mode as ACMode)
        if (latest.fan_speed) setFanSpeed(latest.fan_speed as FanSpeed)
      }
    }
  }, [latest])

  // Fungsi Helper untuk mencatat waktu klik
  const registerAction = () => {
    lastUserActionTime.current = Date.now();
  }

  const handlePowerToggle = () => {
    registerAction();
    const newState = !power;
    setPower(newState); 
    sendCommand({ power: newState });
  };

  const handleTempChange = (delta: number) => {
    registerAction();
    let newTemp = temperature + delta;
    // Limitasi suhu
    if (newTemp < 16) newTemp = 16;
    if (newTemp > 30) newTemp = 30;
    
    setTemperature(newTemp);
    sendCommand({ temp: newTemp });
  };

  const handleModeChange = (newMode: ACMode) => {
    registerAction();
    setMode(newMode);
    sendCommand({ mode: newMode });
  };

  const handleFanChange = (newFan: FanSpeed) => {
    registerAction();
    setFanSpeed(newFan);
    sendCommand({ fan: newFan });
  };

  const modes: { value: ACMode; icon: any; label: string }[] = [
    { value: 'COOL', icon: Snowflake, label: 'Cool' },
    { value: 'DRY', icon: Droplets, label: 'Dry' },
    { value: 'FAN', icon: Fan, label: 'Fan' },
    { value: 'AUTO', icon: Gauge, label: 'Auto' },
  ]

  const fanOptions: FanSpeed[] = ['AUTO', 'LOW', 'MEDIUM', 'HIGH']

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="border-b pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{deviceName}</CardTitle>
            <div className="text-xs text-gray-500 mt-1">ID: {deviceId}</div>
          </div>
          <Button
            size="icon"
            onClick={handlePowerToggle}
            className={cn(
              "h-12 w-12 rounded-full transition-all duration-300 shadow-md",
              power 
                ? "bg-green-500 hover:bg-green-600 text-white shadow-green-200" 
                : "bg-gray-200 hover:bg-gray-300 text-gray-500"
            )}
          >
            <Power className="h-6 w-6" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-8">
        
        {/* Temperature Control */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-sm font-medium text-gray-500">TEMPERATURE</div>
          <div className="flex items-center gap-8">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full"
              onClick={() => handleTempChange(-1)}
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
            
            <div className="text-5xl font-bold text-gray-800 tabular-nums">
              {temperature}°
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full"
              onClick={() => handleTempChange(1)}
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mode & Fan */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-400 text-center uppercase">Mode</div>
            <div className="grid grid-cols-4 gap-2">
              {modes.map((m) => (
                <Button
                  key={m.value}
                  variant={mode === m.value ? 'default' : 'outline'}
                  onClick={() => handleModeChange(m.value)}
                  className={cn("flex flex-col h-14", mode === m.value && "bg-blue-600 text-white")}
                >
                  <m.icon className="h-4 w-4 mb-1" />
                  <span className="text-[10px]">{m.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-400 text-center uppercase">Fan Speed</div>
            <div className="grid grid-cols-4 gap-2">
              {fanOptions.map((fan) => (
                <Button
                  key={fan}
                  variant={fanSpeed === fan ? 'default' : 'outline'}
                  onClick={() => handleFanChange(fan)}
                  className="text-xs"
                >
                  {fan}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-50 rounded-lg p-3 text-center border mt-4">
            <div className="text-xs text-gray-500">Current Status</div>
            <div className="text-sm font-medium text-gray-700">
               {power ? `ON • ${mode} • ${temperature}°C` : 'OFF'}
            </div>
        </div>

      </CardContent>
    </Card>
  )
}