"use client"

import * as React from "react"
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Event = {
  id: string
  title: string
  date: Date
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [events, setEvents] = React.useState<Event[]>([])
  const [newEvent, setNewEvent] = React.useState({ title: "", date: new Date() })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = addDays(monthStart, -1)
  const endDate = addDays(monthEnd, 7)

  const dateRange = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const weeks = []
  let days = []

  dateRange.forEach((day) => {
    if (days.length > 0 && day.getDay() === 0) {
      weeks.push(days)
      days = []
    }
    days.push(day)
    if (dateRange.indexOf(day) === dateRange.length - 1) {
      weeks.push(days)
    }
  })

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault()
    const event = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title,
      date: newEvent.date,
    }
    setEvents([...events, event])
    setNewEvent({ title: "", date: new Date() })
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy", { locale: fr })}</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Mois précédent</span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Mois suivant</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
          <div key={day} className="font-bold text-center py-2">
            {day}
          </div>
        ))}
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`border p-2 h-24 overflow-y-auto ${
                  !isSameMonth(day, monthStart)
                    ? "bg-gray-100 text-gray-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">{format(day, "d")}</div>
                {events
                  .filter((event) => isSameDay(event.date, day))
                  .map((event) => (
                    <div key={event.id} className="text-xs bg-blue-100 p-1 mb-1 rounded">
                      {event.title}
                    </div>
                  ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel événement</DialogTitle>
          </DialogHeader>
          <form onSubmit={addEvent} className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={format(newEvent.date, "yyyy-MM-dd")}
                onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                required
              />
            </div>
            <Button type="submit">Ajouter</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}