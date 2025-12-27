'use client'

import { Calendar } from 'lucide-react'
import { cn, getDayName } from '@/lib/utils'
import type { DayOfWeek } from '@/lib/types'

interface DaySelectorProps {
  selectedDays: DayOfWeek[]
  onChange: (days: DayOfWeek[]) => void
  disabled?: boolean
}

const DAYS: DayOfWeek[] = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']

export function DaySelector({ selectedDays, onChange, disabled = false }: DaySelectorProps) {
  const toggleDay = (day: DayOfWeek) => {
    if (disabled) return
    
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day))
    } else {
      onChange([...selectedDays, day])
    }
  }

  const selectWeekdays = () => {
    if (disabled) return
    onChange(['senin', 'selasa', 'rabu', 'kamis', 'jumat'])
  }

  const selectWeekend = () => {
    if (disabled) return
    onChange(['sabtu', 'minggu'])
  }

  const selectAll = () => {
    if (disabled) return
    onChange([...DAYS])
  }

  const clearAll = () => {
    if (disabled) return
    onChange([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Select Days
        </label>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectWeekdays}
            disabled={disabled}
            className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
          >
            Weekdays
          </button>
          <button
            type="button"
            onClick={selectWeekend}
            disabled={disabled}
            className="text-xs px-2 py-1 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 disabled:opacity-50"
          >
            Weekend
          </button>
          <button
            type="button"
            onClick={selectAll}
            disabled={disabled}
            className="text-xs px-2 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50"
          >
            All
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day) => {
          const isSelected = selectedDays.includes(day)
          const isWeekend = day === 'sabtu' || day === 'minggu'
          
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
                "hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
                isSelected
                  ? isWeekend
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              <span className="text-xs font-semibold uppercase">
                {day.slice(0, 3)}
              </span>
              <span className="text-[10px] text-gray-500 mt-1">
                {getDayName(day).slice(0, 3)}
              </span>
              {isSelected && (
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}