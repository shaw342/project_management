"use client"

import * as React from "react"
import { Plus, Clock, Brain, Star, Play, Pause, RotateCcw, Trash2, ExternalLink, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface Task {
  id: number
  name: string
  duration: number
  isTopTask: boolean
}

interface SuggestedTask {
  id: number
  name: string
  duration: number
}

// Simulated function to fetch task suggestions
const fetchTaskSuggestions = (): SuggestedTask[] => {
  return [
    { id: 1, name: "Répondre aux emails", duration: 30 },
    { id: 2, name: "Préparer la présentation", duration: 60 },
    { id: 3, name: "Réviser le rapport", duration: 45 },
    { id: 4, name: "Appeler le client", duration: 20 },
    { id: 5, name: "Mise à jour du site web", duration: 90 },
  ]
}

export function TimeBox() {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [newTaskName, setNewTaskName] = React.useState("")
  const [newTaskDuration, setNewTaskDuration] = React.useState("")
  const [brainDump, setBrainDump] = React.useState("")
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)
  const [isRunning, setIsRunning] = React.useState(false)
  const [elapsedTime, setElapsedTime] = React.useState(0)
  const [suggestedTasks, setSuggestedTasks] = React.useState<SuggestedTask[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")

  const router = useRouter()
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    // Fetch task suggestions when component mounts
    const suggestions = fetchTaskSuggestions()
    setSuggestedTasks(suggestions)
  }, [])

  const addTask = (isTopTask: boolean = false, suggestedTask?: SuggestedTask) => {
    if ((newTaskName && newTaskDuration) || suggestedTask) {
      const newTask: Task = suggestedTask
        ? {
            id: Date.now(),
            name: suggestedTask.name,
            duration: suggestedTask.duration,
            isTopTask,
          }
        : {
            id: Date.now(),
            name: newTaskName,
            duration: parseInt(newTaskDuration),
            isTopTask,
          }
      setTasks([...tasks, newTask])
      setNewTaskName("")
      setNewTaskDuration("")
    }
  }

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    if (activeTask && activeTask.id === taskId) {
      resetTask()
    }
  }

  const startTask = (task: Task) => {
    setActiveTask(task)
    setIsRunning(true)
    setElapsedTime(0)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1)
    }, 1000)
  }

  const pauseTask = () => {
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const resetTask = () => {
    setIsRunning(false)
    setElapsedTime(0)
    setActiveTask(null)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0)

  const filteredSuggestions = suggestedTasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Time Box Organisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList>
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="brain-dump">Brain Dump</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-name">Tâche</Label>
                  <Input
                    id="task-name"
                    placeholder="Nom de la tâche"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-duration">Durée (minutes)</Label>
                  <Input
                    id="task-duration"
                    type="number"
                    placeholder="Durée"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(e.target.value)}
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <Button onClick={() => addTask()} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une tâche
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Tâches planifiées :</h3>
                  <ul className="space-y-2">
                    {tasks.filter(task => !task.isTopTask).map((task) => (
                      <li key={task.id} className="flex justify-between items-center">
                        <span>{task.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">{task.duration} min</span>
                          <Button size="sm" onClick={() => startTask(task)}>
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteTask(task.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Star className="mr-2 h-4 w-4 text-yellow-500" />
                    Top Tâches :
                  </h3>
                  <ul className="space-y-2">
                    {tasks.filter(task => task.isTopTask).map((task) => (
                      <li key={task.id} className="flex justify-between items-center">
                        <span>{task.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">{task.duration} min</span>
                          <Button size="sm" onClick={() => startTask(task)}>
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteTask(task.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button onClick={() => addTask(true)} className="w-full mt-4">
                    <Star className="mr-2 h-4 w-4" /> Ajouter une Top Tâche
                  </Button>
                </div>
              </div>
              {activeTask && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Tâche en cours : {activeTask.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
                    <div className="space-x-2">
                      {isRunning ? (
                        <Button onClick={pauseTask}>
                          <Pause className="mr-2 h-4 w-4" /> Pause
                        </Button>
                      ) : (
                        <Button onClick={() => startTask(activeTask)}>
                          <Play className="mr-2 h-4 w-4" /> Reprendre
                        </Button>
                      )}
                      <Button variant="outline" onClick={resetTask}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Réinitialiser
                      </Button>
                      <Link href={`/task/${activeTask.id}?elapsed=${elapsedTime}`} passHref>
                        <Button variant="secondary">
                          <ExternalLink className="mr-2 h-4 w-4" /> Détails
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="suggestions">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 opacity-50" />
                <Input
                  placeholder="Rechercher des suggestions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Command>
                <CommandList>
                  <CommandEmpty>Aucune suggestion trouvée.</CommandEmpty>
                  <CommandGroup heading="Suggestions de tâches">
                    {filteredSuggestions.map((task) => (
                      <CommandItem key={task.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{task.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">{task.duration} min</span>
                            <Button size="sm" onClick={() => addTask(false, task)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </TabsContent>
          <TabsContent value="brain-dump">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brain-dump">Brain Dump</Label>
                <Textarea
                  id="brain-dump"
                  placeholder="Notez rapidement vos idées ici..."
                  value={brainDump}
                  onChange={(e) => setBrainDump(e.target.value)}
                  rows={10}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold">Temps total planifié :</span>
          <span className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {totalDuration} minutes
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

