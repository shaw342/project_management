'use client'

import { useEffect, useState } from 'react'
import { Task, TaskItem } from './task-item'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format, parse, isValid } from 'date-fns'
import axios from 'axios'
import { error, log } from 'console'
import { id } from 'date-fns/locale'

export function DetailedTaskSection() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Task>({
    id:0,
    name: '',
    description: '',
    importance: 'Medium',
    startDate: new Date(),
    endDate: new Date(),
    status: 'Not Started',
    assignee: '',
    priorities: []
  })
  const [newPriority, setNewPriority] = useState('')

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()

    axios.post("http://localhost:8080/api/v1/task",newTask).then(res => {
      console.log(res.data)
      newTask.id = res.data["Id"]
    }).catch(error =>{
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    })

    if (newTask.name.trim()) {
      setTasks([...tasks, { ...newTask, id: newTask.id}])
      setNewTask({
        id:0,
        name: '',
        description: '',
        importance: 'Medium',
        startDate: new Date(),
        endDate: new Date(),
        status: 'Not Started',
        assignee: '',
        priorities: []
      })
    }
  }

  console.log('====================================');
  console.log(tasks);
  console.log('====================================');

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const date = parse(value, 'yyyy-MM-dd', new Date())
    if (isValid(date)) {
      setNewTask({ ...newTask, [field]: date })
    }
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const addPriority = () => {
    if (newPriority.trim()) {
      setNewTask({
        ...newTask,
        priorities: [...newTask.priorities, newPriority.trim()]
      })
      setNewPriority('')
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTask} className="space-y-4">
            <Input
              placeholder="Task Name"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />
            <Textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            
            <Select
              value={newTask.importance}
              onValueChange={(value: Task['importance']) => setNewTask({ ...newTask, importance: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-4">
              <Input
                type="date"
                value={format(newTask.startDate, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
              />
              <Input
                type="date"
                value={format(newTask.endDate, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
              />
            </div>
            <Select
              value={newTask.status}
              onValueChange={(value: Task['status']) => setNewTask({ ...newTask, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                placeholder="Add Priority"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              />
              <Button type="button" onClick={addPriority}>Add</Button>
            </div>
            {newTask.priorities.length > 0 && (
              <ul className="list-disc list-inside">
                {newTask.priorities.map((priority, index) => (
                  <li key={index}>{priority}</li>
                ))}
              </ul>
            )}
            <Button type="submit">Add Task</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onDelete={deleteTask} />
        ))}
      </div>
    </div>
  )
}
