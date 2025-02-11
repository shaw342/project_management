import { TaskManager } from '@/components/task-manager'

export default function TaskPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestionnaire de Tâches Détaillées</h1>
      <TaskManager/>
    </div>
  )
}