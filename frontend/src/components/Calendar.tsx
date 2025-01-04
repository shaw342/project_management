"use client"

import React, { useState, useEffect } from 'react'
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format } from 'date-fns'
import Header from './Header'
import Toolbar from './Toolbar'
import Event from './Event'

// Setup the localizer for BigCalendar
const localizer = momentLocalizer(moment)

interface Task {
  id: number
  title: string
  start: Date
  end: Date
  description: string
}

const Calendar: React.FC = () => {
  const [view, setView] = useState(Views.MONTH)
  const [date, setDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    // Fetch tasks when component mounts
    fetchTasks()
  }, [])

  const fetchTasks = () => {
    // Simulating API call with predefined tasks
    const predefinedTasks: Task[] = [
      {
        id: 1,
        title: 'Project Meeting',
        start: new Date(2023, 5, 15, 10, 0),
        end: new Date(2023, 5, 15, 11, 0),
        description: 'Discuss project milestones and deadlines'
      },
      {
        id: 2,
        title: 'Client Presentation',
        start: new Date(2023, 5, 16, 14, 0),
        end: new Date(2023, 5, 16, 15, 30),
        description: 'Present the new product features to the client'
      },
      {
        id: 3,
        title: 'Team Building',
        start: new Date(2023, 5, 17, 9, 0),
        end: new Date(2023, 5, 17, 17, 0),
        description: 'Full day team building activity'
      },
      {
        id: 4,
        title: 'Code Review',
        start: new Date(2023, 5, 18, 13, 0),
        end: new Date(2023, 5, 18, 14, 0),
        description: 'Review pull requests and merge code'
      },
      {
        id: 5,
        title: 'Product Launch',
        start: new Date(2023, 5, 20, 10, 0),
        end: new Date(2023, 5, 20, 12, 0),
        description: 'Launch the new product version'
      }
    ]
    setTasks(predefinedTasks)
  }

  const onNavigate = (newDate: Date) => {
    setDate(newDate)
  }

  const onView = (newView: any) => {
    setView(newView)
  }

  const handleSelectEvent = (event: Task) => {
    // Redirect to task details (you can replace this with your preferred navigation method)
    alert(`Redirecting to details for task: ${event.title}\n\nDescription: ${event.description}`)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden w-[100%]">
      
      <div className="flex-grow overflow-auto w-[100%]">
        <BigCalendar
          localizer={localizer}
          events={tasks}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={onView}
          date={date}
          onNavigate={onNavigate}
          onSelectEvent={handleSelectEvent}
          components={{
            event: (props) => <Event {...props} />,
          }}
          formats={{
            dayHeaderFormat: (date: Date) => format(date, 'EEE, MMM d'),
            dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`,
            timeGutterFormat: (date: Date) => format(date, 'HH:mm'),
          }}
          className="h-full min-h-[500px]"
          views={['month', 'week', 'day', 'agenda']}
        />
      </div>
    </div>
  )
}

export default Calendar

