'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card'
import { Button } from '@/components/UI/button'
import { TimePicker } from '@/components/UI/time-picker'
import { Calendar, Clock, Save, X } from 'lucide-react'
import { cn, getDayName, getScheduleTypeLabel } from '@/lib/utils'
import type { DaySchedule } from '@/lib/types'

interface ScheduleEditorProps {
  schedule: DaySchedule[]
  onChange: (schedule: DaySchedule[]) => void
  onSave: () => void
  isSaving?: boolean
}

const DAYS = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']

export function ScheduleEditor({ schedule, onChange, onSave, isSaving }: ScheduleEditorProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null)

  const getDaySchedule = (day: string): DaySchedule => {
    return schedule.find(s => s.day === day) || {
      day,
      type: 'full_time',
      waktu: { mulai: '08:00', selesai: '17:00' }
    }
  }

  const updateDaySchedule = (day: string, updates: Partial<DaySchedule>) => {
    const newSchedule = schedule.map(s => 
      s.day === day ? { ...s, ...updates } : s
    )
    
    // Jika day belum ada, tambahkan
    if (!schedule.find(s => s.day === day)) {
      newSchedule.push({
        day,
        type: 'full_time',
        waktu: { mulai: '08:00', selesai: '17:00' },
        ...updates
      } as DaySchedule)
    }
    
    onChange(newSchedule)
  }

  const setScheduleType = (day: string, type: 'full_time' | 'part_time' | 'libur') => {
    const currentSchedule = getDaySchedule(day)
    
    updateDaySchedule(day, {
      type,
      waktu: type === 'part_time' 
        ? (currentSchedule.waktu || { mulai: '08:00', selesai: '17:00' })
        : undefined
    })
  }

  const updateTime = (day: string, field: 'mulai' | 'selesai', time: string) => {
    const currentSchedule = getDaySchedule(day)
    updateDaySchedule(day, {
      waktu: {
        mulai: field === 'mulai' ? time : currentSchedule.waktu?.mulai || '08:00',
        selesai: field === 'selesai' ? time : currentSchedule.waktu?.selesai || '17:00'
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Weekly Schedule
          </CardTitle>
          <Button onClick={onSave} isLoading={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            Save Schedule
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {DAYS.map((day) => {
          const daySchedule = getDaySchedule(day)
          const isExpanded = expandedDay === day
          const isPartTime = daySchedule.type === 'part_time'

          return (
            <div
              key={day}
              className={cn(
                "border-2 rounded-lg transition-all",
                isExpanded ? "border-blue-500 bg-blue-50/50" : "border-gray-200 bg-white"
              )}
            >
              {/* Day Header */}
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white",
                    daySchedule.type === 'libur' ? "bg-red-500" :
                    daySchedule.type === 'part_time' ? "bg-yellow-500" :
                    "bg-green-500"
                  )}>
                    {getDayName(day).slice(0, 3).toUpperCase()}
                  </div>
                  
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">
                      {getDayName(day)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getScheduleTypeLabel(daySchedule.type)}
                      {isPartTime && daySchedule.waktu && (
                        <span className="ml-2">
                          ({daySchedule.waktu.mulai} - {daySchedule.waktu.selesai})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-2xl text-gray-400">
                  {isExpanded ? '−' : '+'}
                </div>
              </button>

              {/* Day Settings (Expanded) */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Schedule Type Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setScheduleType(day, 'full_time')}
                      className={cn(
                        "px-4 py-2 rounded-lg border-2 transition-all",
                        daySchedule.type === 'full_time'
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      <div className="text-sm font-medium">Full Time</div>
                      <div className="text-xs text-gray-500">All day</div>
                    </button>

                    <button
                      onClick={() => setScheduleType(day, 'part_time')}
                      className={cn(
                        "px-4 py-2 rounded-lg border-2 transition-all",
                        daySchedule.type === 'part_time'
                          ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      <div className="text-sm font-medium">Part Time</div>
                      <div className="text-xs text-gray-500">Custom hours</div>
                    </button>

                    <button
                      onClick={() => setScheduleType(day, 'libur')}
                      className={cn(
                        "px-4 py-2 rounded-lg border-2 transition-all",
                        daySchedule.type === 'libur'
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      <div className="text-sm font-medium">Off</div>
                      <div className="text-xs text-gray-500">No operation</div>
                    </button>
                  </div>

                  {/* Time Pickers (only for part_time) */}
                  {isPartTime && (
                    <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Operating Hours
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <TimePicker
                          label="Start Time"
                          value={daySchedule.waktu?.mulai || '08:00'}
                          onChange={(time) => updateTime(day, 'mulai', time)}
                        />
                        
                        <TimePicker
                          label="End Time"
                          value={daySchedule.waktu?.selesai || '17:00'}
                          onChange={(time) => updateTime(day, 'selesai', time)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}