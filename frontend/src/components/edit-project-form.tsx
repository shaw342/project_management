"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Project, Owner, Task, Team } from '@/components/types'

// Ces données devraient idéalement venir d'une API ou d'une base de données
const mockOwners: Owner[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
]

const mockTasks: Task[] = [
  { id: '1', title: 'Conception', status: 'not-started' },
  { id: '2', title: 'Développement', status: 'not-started' },
  { id: '3', title: 'Tests', status: 'not-started' },
]

const mockTeams: Team[] = [
  { id: '1', name: 'Équipe A' },
  { id: '2', name: 'Équipe B' },
]

interface EditProjectFormProps {
  project: Project;
  onProjectUpdated: (updatedProject: Project) => void;
  onCancel: () => void;
}

export function EditProjectForm({ project, onProjectUpdated, onCancel }: EditProjectFormProps) {
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description)
  const [ownerId, setOwnerId] = useState(project.owner.id)
  const [selectedTasks, setSelectedTasks] = useState<string[]>(project.tasks.map(task => task.id))
  const [selectedTeams, setSelectedTeams] = useState<string[]>(project.teams.map(team => team.id))
  const [startDate, setStartDate] = useState<Date | undefined>(project.startDate)
  const [endDate, setEndDate] = useState<Date | undefined>(project.endDate)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) {
      alert("Veuillez sélectionner les dates de début et de fin.")
      return
    }
    const updatedProject: Project = {
      ...project,
      name,
      description,
      owner: mockOwners.find(owner => owner.id === ownerId) || project.owner,
      tasks: mockTasks.filter(task => selectedTasks.includes(task.id)),
      teams: mockTeams.filter(team => selectedTeams.includes(team.id)),
      startDate,
      endDate
    }
    onProjectUpdated(updatedProject)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Modifier le projet</CardTitle>
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
            <label htmlFor="owner" className="text-sm font-medium">Propriétaire</label>
            <Select onValueChange={setOwnerId} value={ownerId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un propriétaire" />
              </SelectTrigger>
              <SelectContent>
                {mockOwners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>{owner.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
          <Button type="submit">Mettre à jour le projet</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

