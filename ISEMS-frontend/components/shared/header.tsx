'use client'

import { useMQTTConnection } from '@/hooks'
import { Wifi, WifiOff, Bell, Search } from 'lucide-react'
import { Button } from '@/components/UI/button'
import { formatTimeOnly } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useServerConnection } from '@/hooks'

export function Header() {
  const { isConnected } = useServerConnection()
  
  // SOLUSI: Inisialisasi dengan null agar Server & Client sepakat "kosong" dulu
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    // Set waktu langsung saat component sudah mount di browser
    setCurrentTime(new Date())

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <header className="fixed left-64 right-0 top-0 z-30 border-b bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section - Page Info */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Good Morning! 👋
            </h2>
            <p className="text-sm text-gray-500 min-h-[20px]">
              {/* Render waktu hanya jika sudah ada (client-side only) */}
              {currentTime ? formatTimeOnly(currentTime) : '...'} WIB
            </p>
          </div>
        </div>

        {/* Right Section - Status & Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search devices..."
              className="h-10 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* MQTT Status Indicator */}
          <div className={cn(
          "flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors",
          isConnected 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        )}>
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4" />
              <span>System Online</span> {/* Indikasi Backend 8883 Aman */}
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span>System Offline</span>
            </>
          )}
        </div>

          {/* Notification Button */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>
          </Button>

          {/* User Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold shadow-md">
            A
          </div>
        </div>
      </div>
    </header>
  )
}