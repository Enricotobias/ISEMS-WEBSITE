'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Search
} from 'lucide-react'
import { formatTimestamp, formatRelativeTime, cn } from '@/lib/utils'
import type { EventLog } from '@/lib/types'
import mqttService from '@/lib/mqtt'
import { useEventLogs } from '@/hooks' // Hook baru untuk data database

interface LogTableProps {
  deviceId: string
}

export function LogTable({ deviceId }: LogTableProps) {
  // 1. Ambil data historis dari Database via API
  const { initialLogs, isLoading } = useEventLogs(deviceId)
  
  // State untuk menampung log baru yang datang via MQTT saat user sedang melihat halaman
  const [realtimeLogs, setRealtimeLogs] = useState<EventLog[]>([])
  
  const [filter, setFilter] = useState<'all' | 'ACK' | 'LOG'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [autoScroll, setAutoScroll] = useState(false)

  // 2. Gabungkan Data Database + Realtime
  // Kita gabungkan, hapus duplikat (jika ada), dan urutkan berdasarkan waktu (Terbaru di atas)
  const displayLogs = [...realtimeLogs, ...initialLogs]
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i) // Hapus duplikat ID
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort Descending

  // 3. Listen MQTT untuk update instan
  useEffect(() => {
    // Reset log realtime saat ganti device agar tidak tercampur
    setRealtimeLogs([]); 

    const cleanup = mqttService.addMessageHandler((topic, message) => {
      const logsTopic = `isems/devices/${deviceId}/logs`
      const ackTopic = `isems/devices/${deviceId}/ack`
      
      let newLog: EventLog | null = null;

      if (topic === logsTopic) {
        // Log Debug dari ESP32
        newLog = {
          id: Date.now(),
          device_id: deviceId,
          type: 'LOG',
          message: message,
          timestamp: new Date().toISOString()
        }
      } 
      else if (topic === ackTopic) {
        // Log Acknowledge Command
        try {
          const ack = JSON.parse(message)
          newLog = {
            id: Date.now(),
            device_id: deviceId,
            type: 'ACK',
            command: ack.cmd,
            status: ack.status,
            message: ack.detail || '',
            timestamp: new Date().toISOString()
          }
        } catch (err) {
          console.error('Failed to parse ACK:', err)
        }
      }

      // Jika ada log baru, tambahkan ke state realtime (paling atas)
      if (newLog) {
        setRealtimeLogs(prev => [newLog!, ...prev])
      }
    })

    return cleanup
  }, [deviceId])

  // 4. Auto Scroll Logic (Opsional)
  useEffect(() => {
    if (autoScroll) {
      const tableBody = document.getElementById('log-table-body')
      if (tableBody) {
        tableBody.scrollTop = 0 
      }
    }
  }, [realtimeLogs, autoScroll])

  // 5. Filter Logic
  const filteredLogs = displayLogs.filter(log => {
    // Filter by type
    if (filter !== 'all' && log.type !== filter) return false
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        log.message?.toLowerCase().includes(query) ||
        log.command?.toLowerCase().includes(query) ||
        log.status?.toLowerCase().includes(query)
      )
    }
    
    return true
  })

  // 6. Export CSV
  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Type', 'Command', 'Status', 'Message'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.type,
        log.command || '',
        log.status || '',
        log.message
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${deviceId}-${Date.now()}.csv`
    a.click()
  }

  // Helper Icon Status
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
      default:
        return <FileText className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Event Logs
            <span className="text-sm font-normal text-gray-500">
              ({filteredLogs.length} entries)
            </span>
          </CardTitle>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex gap-3 mt-4">
          {/* Type Filter */}
          <div className="flex gap-2">
            {(['all', 'ACK', 'LOG'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  "px-3 py-1 text-sm rounded-lg transition-all",
                  filter === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Auto Scroll Toggle */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            Auto-scroll
          </label>
        </div>
      </CardHeader>

      <CardContent>
        {/* Table */}
        <div 
          id="log-table-body"
          className="overflow-auto max-h-[600px] border rounded-lg"
        >
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Command
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading && filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 mb-2" />
                        Loading logs...
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    No logs available
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr 
                    key={log.id}
                    className={cn(
                      "hover:bg-gray-50 transition-colors",
                      log.type === 'ACK' && log.status === 'failed' && "bg-red-50/50"
                    )}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      <div>
                        {formatRelativeTime(log.timestamp)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full",
                        log.type === 'ACK' 
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      )}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {log.command || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        {log.status && (
                          <span className="text-sm capitalize">
                            {log.status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-md">
                      <div className="line-clamp-2" title={log.message}>
                        {log.message}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}