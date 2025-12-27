'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimePickerProps {
  value: string // Format: "HH:MM"
  onChange: (time: string) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function TimePicker({ 
  value, 
  onChange, 
  label, 
  disabled = false,
  className 
}: TimePickerProps) {
  const [hours, minutes] = value.split(':').map(Number)
  
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hour = parseInt(e.target.value) || 0
    hour = Math.max(0, Math.min(23, hour))
    onChange(`${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)
  }
  
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let minute = parseInt(e.target.value) || 0
    minute = Math.max(0, Math.min(59, minute))
    onChange(`${hours.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
  }

  const incrementHour = () => {
    const newHour = (hours + 1) % 24
    onChange(`${newHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)
  }

  const decrementHour = () => {
    const newHour = hours === 0 ? 23 : hours - 1
    onChange(`${newHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)
  }

  const incrementMinute = () => {
    const newMinute = (minutes + 1) % 60
    onChange(`${hours.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`)
  }

  const decrementMinute = () => {
    const newMinute = minutes === 0 ? 59 : minutes - 1
    onChange(`${hours.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-2">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={incrementHour}
            disabled={disabled}
            className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            ▲
          </button>
          <input
            type="number"
            min="0"
            max="23"
            value={hours.toString().padStart(2, '0')}
            onChange={handleHourChange}
            disabled={disabled}
            className={cn(
              "w-16 text-center text-2xl font-bold border-2 rounded-lg py-2",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              disabled && "bg-gray-100 cursor-not-allowed"
            )}
          />
          <button
            type="button"
            onClick={decrementHour}
            disabled={disabled}
            className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            ▼
          </button>
        </div>

        <span className="text-3xl font-bold text-gray-400">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={incrementMinute}
            disabled={disabled}
            className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            ▲
          </button>
          <input
            type="number"
            min="0"
            max="59"
            value={minutes.toString().padStart(2, '0')}
            onChange={handleMinuteChange}
            disabled={disabled}
            className={cn(
              "w-16 text-center text-2xl font-bold border-2 rounded-lg py-2",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              disabled && "bg-gray-100 cursor-not-allowed"
            )}
          />
          <button
            type="button"
            onClick={decrementMinute}
            disabled={disabled}
            className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  )
}