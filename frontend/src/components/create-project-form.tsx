"use client"

import { useState,useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Project, Owner, Task, Team } from '@/components/types'
import axios from 'axios'
import { getCookie } from 'cookies-next/client'
import { redirect } from 'next/dist/server/api-utils'
import { projectEntrypointsSubscribe } from 'next/dist/build/swc/generated-native'

// Ces données devraient idéalement venir d'une API ou d'une base de données


const mockTasks: Task[] = [
  { id: '1', title: 'Conception', status: 'not-started' },
  { id: '2', title: 'Développement', status: 'not-started' },
  { id: '3', title: 'Tests', status: 'not-started' },
]

const mockTeams: Team[] = [
  { id: '1', name: 'Équipe A' },
  { id: '2', name: 'Équipe B' },
]

export function CreateProjectForm({ onProjectCreated }: { onProjectCreated: (project: Project) => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [token,setToken] = useState("")
  const [owner,setOwner] = useState<Owner>({
    id:"",
    name:"",
    email:"",
  })
  const [ownerId, setOwnerId] = useState('')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)


  useEffect(() => {
    const cookieToken = getCookie("token") as string | undefined;
    if (cookieToken) {
      setToken(cookieToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${cookieToken}`;
    }
  }, []);

  axios.get("http://localhost:8080/api/v1/user/get").then(res => {
    console.log(res.data);
  }).catch(error =>{
    console.log('====================================');
    console.log(error);
    console.log('====================================');
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) {
      alert("Veuillez sélectionner les dates de début et de fin.")
      return
    }

    const newProject: Project = {
      id: "",
      name,
      owner,
      description,
      tasks: mockTasks.filter(task => selectedTasks.includes(task.id)),
      teams: mockTeams.filter(team => selectedTeams.includes(team.id)),
      startDate,
      endDate
    }

    console.log(newProject.startDate);
    
    axios.post("http://localhost:8080/api/v1/project",newProject)
    .then(res =>{
      console.log('====================================');
      console.log(res.data["id"]);
      console.log('====================================');
      console.log(res.data["name"]);
      console.log('====================================');
      newProject.id = res.data["id"]
      onProjectCreated(res.data)
      console.log('====================================');
    }).catch(error => {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    })


    setName(newProject.name)
    console.log('====================================');
    console.log(newProject);
    console.log('====================================');
    setDescription(newProject.description)
    setOwnerId('')
    setSelectedTasks([])
    setSelectedTeams([])
    setStartDate(undefined)
    setEndDate(undefined)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Créer un nouveau projet</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Nom du projet</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tâches</label>
            <div className="flex flex-wrap gap-2">
              {mockTasks.map((task) => (
                <Button
                  key={task.id}
                  type="button"
                  variant={selectedTasks.includes(task.id) ? "default" : "outline"}
                  onClick={() => setSelectedTasks(prev => 
                    prev.includes(task.id) ? prev.filter(id => id !== task.id) : [...prev, task.id]
                  )}
                >
                  {task.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Équipes</label>
            <div className="flex flex-wrap gap-2">
              {mockTeams.map((team) => (
                <Button
                  key={team.id}
                  type="button"
                  variant={selectedTeams.includes(team.id) ? "default" : "outline"}
                  onClick={() => setSelectedTeams(prev => 
                    prev.includes(team.id) ? prev.filter(id => id !== team.id) : [...prev, team.id]
                  )}
                >
                  {team.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date de début</label>
            <DatePicker date={startDate} setDate={setStartDate} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date de fin</label>
            <DatePicker date={endDate} setDate={setEndDate} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Créer le projet</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

