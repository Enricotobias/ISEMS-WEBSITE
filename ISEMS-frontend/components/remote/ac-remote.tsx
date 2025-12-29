'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card'
import { Button } from '@/components/UI/button'
import { useRemoteControl } from '@/hooks' // Kita pakai hook control saja
import { 
  Power, ChevronUp, ChevronDown, Wind, 
  Snowflake, Droplets, Fan, Gauge, Thermometer 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ACMode, FanSpeed } from '@/lib/types'
import useSWR from 'swr'
import { automationAPI, telemetryAPI, controlAPI } from '@/lib/api'
import { mqttService } from '@/lib/mqtt'

interface ACRemoteProps {
  deviceId: string
  deviceName: string
}

export function ACRemote({ deviceId, deviceName }: ACRemoteProps) {
  const { sendCommand } = useRemoteControl(deviceId)
  
  // --- STATE LOKAL ---
  const [power, setPower] = useState(false)
  const [temperature, setTemperature] = useState(24)
  const [mode, setMode] = useState<ACMode>('COOL')
  const [fanSpeed, setFanSpeed] = useState<FanSpeed>('AUTO')
  const [roomTemp, setRoomTemp] = useState<number>(0) // State untuk Suhu Ruangan

  // Ref untuk mencegah konflik update antara User vs MQTT
  const lastUserActionTime = useRef<number>(0)

  // 1. FETCH INITIAL STATE (Settings) DARI DATABASE
  // Agar saat direfresh, power/mode/suhu sesuai terakhir disimpan
useSWR(
    `/devices/${deviceId}/last-state`,
    () => controlAPI.getLastState(deviceId),
    {
      onSuccess: (data) => {
        // Cek debounce agar tidak menimpa aksi user saat ini
        if (Date.now() - lastUserActionTime.current > 3000 && data) {
          
          // Ambil data dari history command terakhir
          if (data.temp) setTemperature(Number(data.temp));
          if (data.mode) setMode(data.mode as ACMode);
          if (data.fan) setFanSpeed(data.fan as FanSpeed);
          
          // Power juga diambil dari command terakhir
          if (data.power !== undefined) {
             setPower(Boolean(data.power));
          }
        }
      },
      // Refresh setiap 5 detik untuk sync jika ada HP lain yang kirim command
      refreshInterval: 5000, 
      revalidateOnFocus: true
    }
  )

// 2. FETCH TELEMETRY TERAKHIR (Untuk Status Power & Room Temp Real)
  // Perbaikan: Menggunakan getHistory limit 1
  useSWR(
    `/devices/${deviceId}/telemetry/latest`, // Key untuk cache SWR
    () => telemetryAPI.getHistory(deviceId, 1), // Fetcher function
    {
      onSuccess: (data) => {
        // Data adalah array, ambil elemen pertama [0]
        if (data && data.length > 0) {
          const latest = data[0];
          
          // Update Room Temp
          if (latest.current_temp) setRoomTemp(Number(latest.current_temp))

          // Update Power Status Real-time dari sensor
          if (latest.power !== undefined) {
             // Convert number 1/0 to boolean
             setPower(Boolean(latest.power))
          }

          // Update Mode/Fan dari status terakhir device (jika ada di log)
          if (latest.mode) setMode(latest.mode as ACMode)
          if (latest.fan_speed) setFanSpeed(latest.fan_speed as FanSpeed)
        }
      },
      revalidateOnFocus: false,
      refreshInterval: 5000 // Polling backup setiap 5 detik jika MQTT mati
    }
  )

  // 3. MQTT LISTENER (REAL-TIME UPDATES)
  useEffect(() => {
    const topicData = `isems/devices/${deviceId}/data`    // Room Temp
    const topicSetting = `isems/devices/${deviceId}/setting` // Status AC

    const handleMqttMessage = (topic: string, message: string) => {
      try {
        const payload = JSON.parse(message)

        // Update Room Temp Real-time
        if (topic === topicData && payload.current_temp) {
          setRoomTemp(Number(payload.current_temp))
        }

        // Update Status AC Real-time (Sync dengan HP lain/Remote Fisik)
        if (topic === topicSetting) {
          const now = Date.now()
          // Cek debounce agar tidak loncat saat user lagi klik-klik
          if (now - lastUserActionTime.current > 3000) {
             if (payload.set_temp) setTemperature(payload.set_temp)
             if (payload.set_mode) setMode(payload.set_mode)
             if (payload.fan_speed) setFanSpeed(payload.fan_speed)
             if (payload.power !== undefined) setPower(payload.power)
          }
        }
      } catch (err) {
        console.error('MQTT Parse Error:', err)
      }
    }

    // Subscribe & Listen
    const client = mqttService.getClient()
    if (client) client.subscribe([topicData, topicSetting])
    
    const cleanup = mqttService.addMessageHandler(handleMqttMessage)
    return () => cleanup()
  }, [deviceId])


  // --- HANDLERS ---
  const registerAction = () => {
    lastUserActionTime.current = Date.now();
  }

  const handlePowerToggle = () => {
    registerAction();
    const newState = !power;
    setPower(newState); 
    // Kirim full payload agar backend tahu konteksnya
    sendCommand({ power: newState, temp: temperature, mode, fan: fanSpeed });
  };

  const handleTempChange = (delta: number) => {
    registerAction();
    let newTemp = temperature + delta;
    if (newTemp < 16) newTemp = 16;
    if (newTemp > 30) newTemp = 30;
    
    setTemperature(newTemp);
    sendCommand({ power, temp: newTemp, mode, fan: fanSpeed });
  };

  const handleModeChange = (newMode: ACMode) => {
    registerAction();
    setMode(newMode);
    sendCommand({ power, temp: temperature, mode: newMode, fan: fanSpeed });
  };

  const handleFanChange = (newFan: FanSpeed) => {
    registerAction();
    setFanSpeed(newFan);
    sendCommand({ power, temp: temperature, mode, fan: newFan });
  };

  const modes: { value: ACMode; icon: any; label: string }[] = [
    { value: 'COOL', icon: Snowflake, label: 'Cool' },
    { value: 'DRY', icon: Droplets, label: 'Dry' },
    { value: 'FAN', icon: Fan, label: 'Fan' },
    { value: 'AUTO', icon: Gauge, label: 'Auto' },
  ]

  const fanOptions: FanSpeed[] = ['AUTO', 'LOW', 'MEDIUM', 'HIGH']

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg bg-white">
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
              "h-12 w-12 rounded-full transition-all duration-300 shadow-md border-4",
              power 
                ? "bg-green-500 hover:bg-green-600 text-white shadow-green-200 border-green-100" 
                : "bg-red-500 hover:bg-red-600 text-white shadow-red-200 border-red-100"
            )}
          >
            <Power className="h-6 w-6" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-8">
        
        {/* Temperature Control */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-xs font-bold text-gray-400 tracking-widest">TARGET TEMPERATURE</div>
          <div className="flex items-center gap-8">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-14 w-14 rounded-full border-2"
              onClick={() => handleTempChange(-1)}
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
            
            <div className="relative">
                <div className="text-6xl font-bold text-gray-800 tabular-nums w-32 text-center">
                  {temperature}°
                </div>
                {/* ROOM TEMP BADGE */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500 border border-gray-200">
                        <Thermometer className="h-3 w-3" />
                        <span>Room: {roomTemp > 0 ? roomTemp : '--'}°C</span>
                    </div>
                </div>
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-14 w-14 rounded-full border-2"
              onClick={() => handleTempChange(1)}
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Spacer untuk memberi ruang badge room temp */}
        <div className="h-4"></div>

        {/* Mode & Fan */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wider">Operation Mode</div>
            <div className="grid grid-cols-4 gap-2">
              {modes.map((m) => (
                <Button
                  key={m.value}
                  variant={mode === m.value ? 'default' : 'outline'}
                  onClick={() => handleModeChange(m.value)}
                  className={cn(
                    "flex flex-col h-14 transition-all", 
                    mode === m.value 
                        ? "bg-blue-600 text-white shadow-md border-blue-600" 
                        : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <m.icon className="h-4 w-4 mb-1" />
                  <span className="text-[10px] font-semibold">{m.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wider">Fan Speed</div>
            <div className="grid grid-cols-4 gap-2">
              {fanOptions.map((fan) => (
                <Button
                  key={fan}
                  variant={fanSpeed === fan ? 'default' : 'outline'}
                  onClick={() => handleFanChange(fan)}
                  className={cn(
                    "text-[10px] font-semibold h-10 transition-all",
                    fanSpeed === fan 
                        ? "bg-green-600 text-white shadow-md border-green-600"
                        : "text-gray-500"
                  )}
                >
                  {fan}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-50 rounded-lg p-3 text-center border mt-4">
            <div className="text-xs text-gray-400 mb-1">CURRENT STATUS</div>
            <div className="text-sm font-medium text-gray-700 flex items-center justify-center gap-2">
               {power ? (
                 <>
                    <span className="text-green-600 font-bold">ON</span>
                    <span className="text-gray-300">•</span>
                    <span>{mode}</span>
                    <span className="text-gray-300">•</span>
                    <span>{fanSpeed}</span>
                    <span className="text-gray-300">•</span>
                    <span>{temperature}°C</span>
                 </>
               ) : (
                 <span className="text-red-500 font-bold">OFF</span>
               )}
            </div>
        </div>

      </CardContent>
    </Card>
  )
}