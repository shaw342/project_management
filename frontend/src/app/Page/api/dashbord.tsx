"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BellIcon, CalendarIcon, CheckCircleIcon, UserIcon } from "lucide-react"

export default function BentoDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="p-4 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tasks Cell */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircleIcon className="mr-2 h-5 w-5" />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full pr-4">
              {["Complete project proposal", "Review team performance", "Prepare for client meeting", "Update documentation"].map((task, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Checkbox id={`task-${index}`} />
                  <label
                    htmlFor={`task-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {task}
                  </label>
                </div>
              ))}
            </ScrollArea>
            <Button className="w-full mt-4">Add New Task</Button>
          </CardContent>
        </Card>

        {/* Team Cell */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserIcon className="mr-2 h-5 w-5" />
              Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              {[
                { name: "Alice Smith", role: "Designer", avatar: "/placeholder-avatar-1.png" },
                { name: "Bob Johnson", role: "Developer", avatar: "/placeholder-avatar-2.png" },
                { name: "Carol Williams", role: "Manager", avatar: "/placeholder-avatar-3.png" },
                { name: "David Brown", role: "Marketing", avatar: "/placeholder-avatar-4.png" },
              ].map((member, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications Cell */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BellIcon className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full pr-4">
              {[
                { message: "New comment on your post", time: "5 min ago" },
                { message: "You have a new follower", time: "1 hour ago" },
                { message: "Your project was approved", time: "2 hours ago" },
                { message: "Remember to update your profile", time: "1 day ago" },
              ].map((notification, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Calendar Cell */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            {date && (
              <p className="mt-4 text-sm">
                Selected date: {date.toDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}