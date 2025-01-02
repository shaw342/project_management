'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Play, Pause, RotateCcw, Trash2, Star, Plus, X } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface TimeBlock {
  task: string
  duration: number
  isPriority: boolean
}

export default function HarvardTimeBox() {
  const [blocks, setBlocks] = useState<TimeBlock[]>([])
  const [currentTask, setCurrentTask] = useState('')
  const [currentDuration, setCurrentDuration] = useState(0)
  const [isPriorityTask, setIsPriorityTask] = useState(false)
  const [activeBlock, setActiveBlock] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [brainDump, setBrainDump] = useState('')
  const [topTasks, setTopTasks] = useState<string[]>([])
  const [newTopTask, setNewTopTask] = useState('')

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && activeBlock !== null) {
      setIsRunning(false)
      setActiveBlock(null)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, activeBlock])

  const addBlock = () => {
    if (currentTask && currentDuration > 0) {
      setBlocks([...blocks, { task: currentTask, duration: currentDuration * 60, isPriority: isPriorityTask }])
      setCurrentTask('')
      setCurrentDuration(0)
      setIsPriorityTask(false)
    }
  }

  const deleteBlock = (index: number) => {
    const newBlocks = [...blocks]
    newBlocks.splice(index, 1)
    setBlocks(newBlocks)
  }

  const startBlock = (index: number) => {
    setActiveBlock(index)
    setTimeLeft(blocks[index].duration)
    setIsRunning(true)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (activeBlock !== null) {
      setTimeLeft(blocks[activeBlock].duration)
    }
  }

  const addTopTask = () => {
    if (newTopTask.trim() !== '') {
      setTopTasks([...topTasks, newTopTask.trim()])
      setNewTopTask('')
    }
  }

  const deleteTopTask = (index: number) => {
    const newTopTasks = [...topTasks]
    newTopTasks.splice(index, 1)
    setTopTasks(newTopTasks)
  }

  const handleTopTaskCheck = (index: number) => {
    const newTopTasks = [...topTasks]
    newTopTasks[index] = newTopTasks[index].startsWith('✓ ') 
      ? newTopTasks[index].slice(2) 
      : `✓ ${newTopTasks[index]}`
    setTopTasks(newTopTasks)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full max-w-7xl mx-auto p-8">
      <CardHeader>
        <CardTitle className="text-5xl font-bold mb-6">Harvard Time Box</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="task" className="text-xl">Tâche</Label>
                <Input
                  id="task"
                  value={currentTask}
                  onChange={(e) => setCurrentTask(e.target.value)}
                  placeholder="Entrez une tâche"
                  className="text-xl p-4"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="duration" className="text-xl">Durée (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={currentDuration || ''}
                  onChange={(e) => setCurrentDuration(parseInt(e.target.value) || 0)}
                  min="1"
                  className="text-xl p-4"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="priorityTask"
                  checked={isPriorityTask}
                  onCheckedChange={(checked) => setIsPriorityTask(checked as boolean)}
                  className="w-6 h-6"
                />
                <Label htmlFor="priorityTask" className="text-xl">Tâche prioritaire</Label>
              </div>
              <Button onClick={addBlock} className="w-full text-xl py-6">Ajouter un bloc</Button>
            </div>
            <div className="space-y-3">
              <Label htmlFor="brainDump" className="text-xl">Brain Dump</Label>
              <Textarea
                id="brainDump"
                placeholder="Notez rapidement vos idées ici..."
                value={brainDump}
                onChange={(e) => setBrainDump(e.target.value)}
                className="h-80 text-xl p-4"
              />
            </div>
          </div>
          <div className="space-y-10">
            <div className="space-y-4">
              <Label className="text-xl">Tâches Prioritaires</Label>
              <div className="flex space-x-2">
                <Input
                  value={newTopTask}
                  onChange={(e) => setNewTopTask(e.target.value)}
                  placeholder="Nouvelle tâche prioritaire"
                  className="text-xl p-4"
                />
                <Button onClick={addTopTask} className="text-xl px-6">
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
              {topTasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-3 bg-secondary rounded-lg p-3">
                  <Checkbox
                    id={`topTask${index}`}
                    checked={task.startsWith('✓ ')}
                    onCheckedChange={() => handleTopTaskCheck(index)}
                    className="w-6 h-6"
                  />
                  <span className="text-xl flex-grow">
                    {task.startsWith('✓ ') ? task.slice(2) : task}
                  </span>
                  <Button onClick={() => deleteTopTask(index)} variant="destructive" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <Label className="text-xl">Blocs de temps</Label>
              {blocks.map((block, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-secondary rounded-lg text-xl">
                  <div className="flex items-center space-x-3">
                    {block.isPriority && <Star className="h-6 w-6 text-yellow-500" />}
                    <span>{block.task} ({formatTime(block.duration)})</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => startBlock(index)} disabled={activeBlock !== null} className="text-lg px-4 py-2">
                      Démarrer
                    </Button>
                    <Button onClick={() => deleteBlock(index)} variant="destructive" size="icon">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {activeBlock !== null && (
              <div className="mt-8 text-center p-6 bg-primary/10 rounded-lg">
                <div className="text-7xl font-bold mb-6">{formatTime(timeLeft)}</div>
                <div className="flex justify-center space-x-6">
                  <Button onClick={toggleTimer} className="text-xl py-4 px-8">
                    {isRunning ? <Pause className="mr-2 h-6 w-6" /> : <Play className="mr-2 h-6 w-6" />}
                    {isRunning ? 'Pause' : 'Reprendre'}
                  </Button>
                  <Button onClick={resetTimer} variant="outline" className="text-xl py-4 px-8">
                    <RotateCcw className="mr-2 h-6 w-6" />
                    Réinitialiser
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between items-center mt-8">
        <Clock className="h-10 w-10" />
        <span className="text-xl text-muted-foreground">Gérez votre temps efficacement</span>
      </CardFooter>
    </Card>
  )
}
