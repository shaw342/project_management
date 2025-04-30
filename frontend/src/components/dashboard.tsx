"use client"

import { useState } from "react"
import {
  Menu,
  Search,
  Bell,
  ChevronRight,
  MessageSquare,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { teamData } from "@/components/data"
import { TeamTable } from "@/components/table-team"


export default function DashboardDemo() {

  return (
    <div className="flex flex-col h-[1500px] bg-muted/40 w-[100%] justify-between">
      <div className="flex ">
        <Card className="h-[400px] w-[400px]">
          <CardHeader>
            <CardTitle>TASK NAME</CardTitle>
          <CardDescription>
            today you have this task
          </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-evenly h-[250px]">
            <div>
            <Badge color="red">High</Badge>
            </div>
            <div className="flex flex-col h-[200px] justify-around">
              <div>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur natus adipisci deserunt sunt.</p>
              </div>
            <div className="flex justify-between">
            <Calendar color="blue"/> 
            <p>start a  end a </p>
            </div>
            <div>
            <h1>Owner : shawan</h1>
            </div>
            </div>
          </CardContent>
          <CardFooter>

            <Button variant='outline'>check<ChevronRight/></Button>
          </CardFooter>
        </Card>
        <Card>
          <CardContent>

          </CardContent>
        </Card>
      </div>
      <div className="w-[100%] flex justify-center">
      <Card className="h-[800px] w-[1200px]">
        <CardContent>
        <TeamTable data={teamData}/>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
