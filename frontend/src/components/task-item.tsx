import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export interface Task {
  id: number
  name: string
  description: string
  importance: 'Low' | 'Medium' | 'High'
  startDate: Date
  endDate: Date
  status: 'Not Started' | 'In Progress' | 'Completed'
  assignee: string
  priorities: string[]
}

interface TaskItemProps {
  task: Task
  onDelete: (id: number) => void
}

export function TaskItem({ task, onDelete }: TaskItemProps) {
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

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{task.name}</span>
          <div className="flex items-center space-x-2">
            <Badge className={getImportanceColor(task.importance)}>{task.importance}</Badge>
            <Link href={`/tasks/${task.id}`} passHref>
              <Button variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 mr-2" />
                More
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-2">{task.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Start: {format(task.startDate, 'PP')}</span>
          <span>End: {format(task.endDate, 'PP')}</span>
        </div>
        <Badge className={`mt-2 ${getStatusColor(task.status)}`}>{task.status}</Badge>
      </CardContent>
    </Card>
  )
}

