"use client"

import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Event = {
  id: string
  title: string
  start: Date
  end: Date
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState<Partial<Event>>({})

  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

  const prevWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const nextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const addEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      setEvents([...events, { ...newEvent, id: Date.now().toString() } as Event])
      setNewEvent({})
    }
  }

  const getEventsForDateAndHour = (date: Date, hour: number) => {
    return events.filter(event => 
      event.start.getDate() === date.getDate() &&
      event.start.getMonth() === date.getMonth() &&
      event.start.getFullYear() === date.getFullYear() &&
      event.start.getHours() === hour
    )
  }

  return (
    <Card className="w-full max-w-[1400px] mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevWeek}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold">
              {startOfWeek.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="outline" size="icon" onClick={nextWeek}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newEvent.title || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start" className="text-right">
                    Start
                  </Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={newEvent.start ? newEvent.start.toISOString().slice(0, 16) : ''}
                    onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="end" className="text-right">
                    End
                  </Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={newEvent.end ? newEvent.end.toISOString().slice(0, 16) : ''}
                    onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={addEvent}>Add Event</Button>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-2">
          <div></div>
          {DAYS.map((day, index) => {
            const date = new Date(startOfWeek)
            date.setDate(startOfWeek.getDate() + index)
            return (
              <div key={day} className="text-center">
                <div className="font-semibold">{day}</div>
                <div className="text-sm text-muted-foreground">{date.getDate()}</div>
              </div>
            )
          })}
          <ScrollArea className="h-[600px] col-span-8">
            <div className="relative">
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 gap-2 border-t">
                  <div className="text-right text-sm text-muted-foreground pr-2">
                    {hour}:00
                  </div>
                  {DAYS.map((_, dayIndex) => {
                    const date = new Date(startOfWeek)
                    date.setDate(startOfWeek.getDate() + dayIndex)
                    date.setHours(hour)
                    const cellEvents = getEventsForDateAndHour(date, hour)
                    return (
                      <div key={dayIndex} className="h-12 border-l relative">
                        {cellEvents.map((event) => (
                          <div
                            key={event.id}
                            className="absolute left-0 right-0 bg-primary/10 text-primary text-xs p-1 overflow-hidden"
                            style={{
                              top: `${(event.start.getMinutes() / 60) * 100}%`,
                              height: `${((event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60)) * 100}%`,
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}