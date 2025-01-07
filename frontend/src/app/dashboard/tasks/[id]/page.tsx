'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Task } from '@/components/task-item'
import { X } from 'lucide-react'
import axios from "axios"
import useSWR from "swr"

const fetcher = (url: any) => axios.get(url).then(res => res.data)

interface TodoItem { 
    id: number;
    text: string;
    completed: boolean;
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [task, setTask] = useState<Task | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedTask, setEditedTask] = useState<Task | null>(null)
    const [todos, setTodos] = useState<TodoItem[]>([])
    const [newTodo, setNewTodo] = useState('')
    const [newPriority, setNewPriority] = useState('')

    const {data,error} = useSWR("https://jsonplaceholder.typicode.com/posts/1",fetcher)

    console.log('====================================');
    console.log(data);
    console.log('====================================');

    useEffect(() => {
    const mockTask: Task = {
        id: parseInt(params.id),
        name: 'Example Task',
        description: 'This is an example task description.',
        importance: 'Medium',
        startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'In Progress',
        assignee: 'John Doe',
        priorities: ['Complete design', 'Implement backend', 'Write tests']
    }

    setTask(mockTask)
    setEditedTask(mockTask)
    setTodos([
        { id: 1, text: 'Create wireframes', completed: true },
        { id: 2, text: 'Design UI components', completed: false },
        { id: 3, text: 'Implement responsive layout', completed: false },
    ])
    }, [params.id])

    if (!task) {
        return <div>Loading...</div>
    }

    const getImportanceColor = (importance: Task['importance']) => {
        switch (importance) {
            case 'Low': return 'bg-blue-100 text-blue-800'
            case 'Medium': return 'bg-yellow-100 text-yellow-800'
            case 'High': return 'bg-red-100 text-red-800'
        }
    }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Not Started': return 'bg-gray-100 text-gray-800'
      case 'In Progress': return 'bg-purple-100 text-purple-800'
      case 'Completed': return 'bg-green-100 text-green-800'
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedTask) {
      setTask(editedTask)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditedTask(task)
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, [e.target.name]: e.target.value })
    }
  }

  const handleStatusChange = (value: Task['status']) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, status: value })
    }
  }

  const handleAddPriority = (e: React.FormEvent) => {
    e.preventDefault()
    if (editedTask && newPriority.trim()) {
      setEditedTask({
        ...editedTask,
        priorities: [...editedTask.priorities, newPriority.trim()]
      })
      setNewPriority('')
    }
  }

  const handleRemovePriority = (index: number) => {
    if (editedTask) {
      const newPriorities = [...editedTask.priorities]
      newPriorities.splice(index, 1)
      setEditedTask({ ...editedTask, priorities: newPriorities })
    }
  }

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false }])
      setNewTodo('')
    }
  }

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        Back to Tasks
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {isEditing ? (
              <Input
                name="name"
                value={editedTask?.name}
                onChange={handleInputChange}
                className="text-2xl font-bold"
              />
            ) : (
              <span>{task.name}</span>
            )}
            <Badge className={getImportanceColor(task.importance)}>{task.importance}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editedTask?.description}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    name="assignee"
                    value={editedTask?.assignee}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={format(editedTask?.startDate || new Date(), 'yyyy-MM-dd')}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={format(editedTask?.endDate || new Date(), 'yyyy-MM-dd')}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editedTask?.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priorities</Label>
                  <ul className="mt-2 space-y-2">
                    {editedTask?.priorities.map((priority, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{priority}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePriority(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <form onSubmit={handleAddPriority} className="mt-2 flex space-x-2">
                    <Input
                      type="text"
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      placeholder="Add new priority"
                      className="flex-grow"
                    />
                    <Button type="submit">Add</Button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <p><strong>Description:</strong> {task.description}</p>
                <p><strong>Assignee:</strong> {task.assignee}</p>
                <div>
                  <strong>Dates:</strong>
                  <p>Start: {format(task.startDate, 'PP')}</p>
                  <p>End: {format(task.endDate, 'PP')}</p>
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </div>
                <div>
                  <strong>Priorities:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {task.priorities.map((priority, index) => (
                      <li key={index}>{priority}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            <div>
              <strong>To-Do List:</strong>
              <ul className="mt-2 space-y-2">
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo.id)}
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}
                    >
                      {todo.text}
                    </label>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleAddTodo} className="mt-2 flex space-x-2">
                <Input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add new to-do item"
                  className="flex-grow"
                />
                <Button type="submit">Add</Button>
              </form>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              </>
            ) : (
              <Button onClick={handleEdit}>Edit</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

