'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useTelemetry } from '@/hooks'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatTimeOnly } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

interface TemperatureChartProps {
  deviceId: string
  limit?: number
}

export function TemperatureChart({ deviceId, limit = 50 }: TemperatureChartProps) {
  const { logs, isLoading } = useTelemetry(deviceId, limit)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Temperature Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-80 items-center justify-center">
            <div className="text-gray-400">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Transform data untuk Recharts
  const chartData = logs
    .slice()
    .reverse()
    .map(log => ({
      time: formatTimeOnly(log.timestamp),
      temperature: log.current_temp,
      power: log.power ? 1 : 0
    }))

  // === PERBAIKAN STATISTIK ===
  // 1. Filter hanya data yang valid (angka)
  const temps = logs
    .map(l => Number(l.current_temp))
    .filter(t => !isNaN(t) && t !== null);

  // 2. Cek apakah array kosong untuk menghindari pembagian dengan nol (NaN)
  const totalTemp = temps.reduce((a, b) => a + b, 0);
  const avgTemp = temps.length > 0 ? totalTemp / temps.length : 0;
  
  // 3. Min/Max dengan fallback
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0;
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Temperature Trend
        </CardTitle>
        <CardDescription>
          Real-time temperature monitoring - Last {logs.length} readings
        </CardDescription>
        
        {/* Statistics */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-blue-50 p-3">
            <div className="text-xs text-gray-600">Average</div>
            <div className="text-lg font-bold text-blue-600">
              {/* FIX: Gunakan Math.round agar bulat tanpa koma */}
              {Math.round(avgTemp)}°C
            </div>
          </div>
          <div className="rounded-lg bg-green-50 p-3">
            <div className="text-xs text-gray-600">Min</div>
            <div className="text-lg font-bold text-green-600">
              {Math.round(minTemp)}°C
            </div>
          </div>
          <div className="rounded-lg bg-red-50 p-3">
            <div className="text-xs text-gray-600">Max</div>
            <div className="text-lg font-bold text-red-600">
              {Math.round(maxTemp)}°C
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#888"
              style={{ fontSize: '12px' }}
              tickMargin={10}
            />
            <YAxis 
              stroke="#888"
              style={{ fontSize: '12px' }}
              domain={[16, 30]}
              ticks={[16, 18, 20, 22, 24, 26, 28, 30]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
              formatter={(value: any, name: string) => {
                if (name === 'temperature') return [`${value}°C`, 'Temperature']
                if (name === 'power') return [value === 1 ? 'ON' : 'OFF', 'Power']
                return [value, name]
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 5 }}
              name="Temperature"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}