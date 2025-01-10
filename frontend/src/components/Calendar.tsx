"use client"

import React, { useState, useEffect } from 'react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachMinuteOfInterval, isSameMonth, isSameDay, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, eachHourOfInterval, startOfDay, endOfDay, isSameHour, parseISO, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Task, fetchTasks, cn } from '@/lib/utils'

type ViewType = 'month' | 'week' | 'day'

const WEEK_START_HOUR = 0
const WEEK_END_HOUR = 24
const MINUTES_STEP = 30

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [viewType, setViewType] = useState<ViewType>('week')

  useEffect(() => {
    fetchTasks().then(setTasks)
  }, [])

  const onDateClick = (day: Date) => {
    setCurrentDate(day)
    if (viewType === 'month') setViewType('day')
  }

  const changeView = (view: ViewType) => {
    setViewType(view)
  }

  const nextDate = () => {
    if (viewType === 'month') setCurrentDate(addMonths(currentDate, 1))
    else if (viewType === 'week') setCurrentDate(addWeeks(currentDate, 1))
    else setCurrentDate(addDays(currentDate, 1))
  }

  const prevDate = () => {
    if (viewType === 'month') setCurrentDate(subMonths(currentDate, 1))
    else if (viewType === 'week') setCurrentDate(subWeeks(currentDate, 1))
    else setCurrentDate(subDays(currentDate, 1))
  }

  const renderHeader = () => {
    const dateFormat = viewType === 'day' ? "d MMMM yyyy" : "MMMM yyyy"
    return (
      <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
        <Button variant="ghost" onClick={prevDate}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-xl font-bold">
          {format(currentDate, dateFormat, { locale: fr })}
        </span>
        <Button variant="ghost" onClick={nextDate}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  const renderDays = () => {
    const dateFormat = "EEEE"
    const days = []
    let startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="col-span-1 text-center py-2 font-bold">
          {format(addDays(startDate, i), dateFormat, { locale: fr })}
        </div>
      )
    }
    return <div className="grid grid-cols-7 bg-accent">{days}</div>
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd)

    const dateFormat = "d"
    const rows = []

    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        days.push(
          <div
            key={day.toString()}
            className={cn(
              "col-span-1 p-2 border border-border",
              !isSameMonth(day, monthStart) && "text-muted-foreground",
              isSameDay(day, new Date()) && "bg-accent",
              "hover:bg-accent hover:text-accent-foreground cursor-pointer"
            )}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="float-right">{format(day, dateFormat)}</span>
            {tasks
              .filter((task) => isSameDay(parseISO(task.date), day))
              .map((task) => (
                <div key={task.id} className={cn(
                  "text-xs mt-1 p-1 rounded truncate",
                  task.status === 'todo' && "bg-yellow-200",
                  task.status === 'in-progress' && "bg-blue-200",
                  task.status === 'done' && "bg-green-200"
                )}>
                  {task.title}
                </div>
              ))}
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      )
      days = []
    }
    return <div className="bg-background">{rows}</div>
  }

  const renderWeek = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
    const endDate = endOfWeek(currentDate)
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const dayStart = startOfDay(startDate)
    const dayEnd = endOfDay(startDate)
    const timeSlots = eachMinuteOfInterval(
      { start: dayStart, end: dayEnd },
      { step: MINUTES_STEP }
    )

    return (
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <div className="flex border-b">
          <div className="w-16"></div>
          {days.map((day) => (
            <div key={day.toString()} className="flex-1 text-center p-2">
              <div className="font-bold">{format(day, 'EEE', { locale: fr })}</div>
              <div className={cn(
                "text-2xl font-bold rounded-full w-8 h-8 mx-auto flex items-center justify-center",
                isSameDay(day, new Date()) && "bg-primary text-primary-foreground"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-1 overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="flex" style={{ height: `${(WEEK_END_HOUR - WEEK_START_HOUR) * 60 * 2}px` }}>
              <div className="w-16 flex-shrink-0">
                {timeSlots.map((slot) => (
                  slot.getMinutes() === 0 && (
                    <div key={slot.toString()} className="h-[60px] text-right pr-2 text-xs text-gray-500">
                      {format(slot, 'HH:mm')}
                    </div>
                  )
                ))}
              </div>
              {days.map((day) => (
                <div key={day.toString()} className="flex-1 min-w-[100px] border-r border-gray-200 relative">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.toString()}
                      className="absolute w-full border-t border-gray-200"
                      style={{ top: `${(slot.getHours() * 60 + slot.getMinutes()) * 2}px` }}
                    ></div>
                  ))}
                  {tasks
                    .filter((task) => isSameDay(parseISO(task.date), day))
                    .map((task) => {
                      const taskDate = parseISO(task.date)
                      const taskStart = taskDate.getHours() * 60 + taskDate.getMinutes()
                      const taskEnd = taskStart + 60 // Assuming 1 hour duration for simplicity
                      return (
                        <div
                          key={task.id}
                          className={cn(
                            "absolute left-0 right-0 mx-1 p-1 text-xs rounded-sm overflow-hidden",
                            task.status === 'todo' && "bg-yellow-200",
                            task.status === 'in-progress' && "bg-blue-200",
                            task.status === 'done' && "bg-green-200"
                          )}
                          style={{
                            top: `${taskStart * 2}px`,
                            height: `${(taskEnd - taskStart) * 2}px`,
                          }}
                        >
                          <div className="font-bold truncate">{task.title}</div>
                          <div className="truncate">{task.description}</div>
                        </div>
                      )
                    })}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    )
  }

  const renderDay = () => {
    const hours = eachHourOfInterval({ start: startOfDay(currentDate), end: endOfDay(currentDate) })

    return (
      <div className="bg-background p-4">
        <h2 className="text-xl font-bold mb-4">{format(currentDate, 'EEEE d MMMM', { locale: fr })}</h2>
        <div className="grid grid-cols-1 gap-2">
          {hours.map((hour) => (
            <div key={hour.toString()} className="flex">
              <div className="w-20 text-right pr-4 text-sm">
                {format(hour, 'HH:mm')}
              </div>
              <div className="flex-grow border-l pl-4 min-h-[60px] relative">
                {tasks
                  .filter((task) => {
                    const taskDate = parseISO(task.date)
                    return isSameDay(taskDate, currentDate) && isSameHour(taskDate, hour)
                  })
                  .map((task) => (
                    <div key={task.id} className={cn(
                      "absolute top-0 left-4 right-0 text-sm p-2 rounded my-1",
                      task.status === 'todo' && "bg-yellow-200",
                      task.status === 'in-progress' && "bg-blue-200",
                      task.status === 'done' && "bg-green-200"
                    )}>
                      <div className="font-bold">{task.title}</div>
                      <div className="text-xs">{task.description}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendrier des tâches</h1>
        <div className="flex items-center space-x-4">
          <Select value={viewType} onValueChange={(value: ViewType) => changeView(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une vue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="day">Jour</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevDate}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              Aujourd'hui
            </Button>
            <Button variant="outline" size="icon" onClick={nextDate}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {renderHeader()}
      {viewType === 'month' && renderDays()}
      {viewType === 'month' && renderCells()}
      {viewType === 'week' && renderWeek()}
      {viewType === 'day' && renderDay()}
    </div>
  )
}

